import { useState, useEffect } from 'react';
import statusApi from '../../api/statusService';

const useDashboardData = () => {
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        lowStockItems: 0,
        salesOverview: [],
        monthlyAverageRevenue: 0,
        totalRevenueLast6Months: 0,
        recentOrders: [],
        categories: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const response = await statusApi.getStatuses();
            if (response.data && response.data.data) {
                const data = response.data.data;
                setDashboardData({
                    totalSales: parseFloat(data.total_sales) || 0,
                    totalOrders: parseInt(data.total_orders) || 0,
                    totalProducts: parseInt(data.total_products) || 0,
                    totalCustomers: parseInt(data.total_customers) || 0,
                    pendingOrders: parseInt(data.total_pending_orders) || 0,
                    lowStockItems: parseInt(data.total_low_stock_products) || 0,
                    salesOverview: data.sales_overview || [],
                    monthlyAverageRevenue: parseFloat(data.monthly_average_revenue) || 0,
                    totalRevenueLast6Months: parseFloat(data.total_revenue_last_6_months) || 0,
                    recentOrders: data.recent_orders || [],
                    categories: data.categories || []
                });
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    return {
        dashboardData,
        loading,
        error,
        refreshData: loadDashboardData
    };
};

export default useDashboardData; 