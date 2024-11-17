const TabGroup = ({ tabs, activeTab, onChange }) => {
    return (
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
export default TabGroup  