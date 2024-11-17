const InfoCard = ({ icon, label, value }) => {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        {icon}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    );
  };

export default InfoCard