import React from "react";
import StatsCard from "./StatsCard";

const StatsGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Users"
        value={data.total_user}
        subtitle="+12% from last month"
        trend="up"
      />
      <StatsCard
        title="Total Products"
        value={data.total_products}
        subtitle="+12% from last month"
        trend="up"
      />

      <StatsCard
        title={"Sales"}
        value={data.total_sales}
        subtitle="Needs attention"
        trend="down"
      />
      <StatsCard
        title="Categories"
        value={data.total_category}
        subtitle="Active categories"
        trend="neutral"
      />
    </div>
  );
};

export default StatsGrid;
