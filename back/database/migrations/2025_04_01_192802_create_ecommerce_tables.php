<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Add countries table first since it's referenced by addresses
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 2)->unique(); // ISO 2-letter country code
            $table->timestamps();
        });

        // Fix 'address' table - renamed to plural form for consistency
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('city');
            $table->string('region');
            $table->string('postal_code');
            $table->string('phone_number', 15);
            $table->foreignId('country_id')->constrained('countries')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        // Added missing tables that seem necessary for this schema
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('product_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('qty_in_stock')->unsigned();
            $table->string('product_image')->nullable();
            $table->decimal('price', 10, 2)->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->decimal('discount_percentage', 5, 2);
            $table->integer('usage_limit')->default(1);
            $table->integer('actual_usage')->default(0);
            $table->boolean('is_active')->default(true); 
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('discount_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('discount_id')->constrained('discounts')->onDelete('cascade');
            $table->timestamps();
        
            $table->unique(['user_id', 'discount_id']); // Ensures one-time use
        });

        Schema::create('shop_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null'); // Link to discount table
            $table->string('order_number')->unique();
            $table->decimal('amount_before_discount', 10, 2); // Store the total amount before discount
            $table->decimal('discount_amount', 10, 2)->default(0); // Store the discount applied
            $table->decimal('total_amount', 10, 2); // Final total after discount (if any)
            $table->text('notes')->nullable();
            $table->timestamp('ordered_at');
            $table->timestamps();
            $table->softDeletes();
        });
        

        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('shop_orders')->onDelete('cascade');
            $table->foreignId('order_status_id')->default(1)->constrained('order_statuses')->onDelete('cascade');
            $table->timestamp('changed_at')->useCurrent();
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('order_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_item_id')->constrained('product_items')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('shop_orders')->onDelete('cascade');
            $table->integer('qty')->unsigned();
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
            $table->softDeletes();
        });

        // Adding payment methods and payment tracking
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('payment_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('description')->nullable();
            $table->timestamps(); 
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('shop_orders')->onDelete('cascade');
            $table->foreignId('payment_method_id')->constrained('payment_methods')->onDelete('cascade');
            $table->string('provider_payment_id')->nullable();
            $table->string('transaction_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->foreignId('payments_status_id')->constrained('payment_statuses')->onDelete('cascade'); // Fixed typo
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->json('details')->nullable();
            $table->softDeletes();
        
            $table->index('provider_payment_id');
            $table->index('transaction_id');
            $table->index('payments_status_id'); // Corrected the index to match payments_status_id
        });
    }

        public function down()
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('payment_statuses');
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('order_lines');
        Schema::dropIfExists('product_items');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('shop_orders');
        Schema::dropIfExists('addresses');  // Drop before countries
        Schema::dropIfExists('countries');  // Drop after addresses
        Schema::dropIfExists('discount_user');
        Schema::dropIfExists('discounts');
        Schema::dropIfExists('order_statuses');
    }
};