const StatsCard = ({ title, value, subtitle, trend }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      </div>
    );
  };

export default StatsCard