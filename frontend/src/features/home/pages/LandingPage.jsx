import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BoxIcon, Users } from "lucide-react";
import Header from "../../../common/Header";
import api from "../../../services/api";

const LandingPage = () => {
  const [stats, setStatus] = useState([]);

  const getData = async () => {
    try {
      const res = await api.get("/api/landing-page/");
      console.log(res.data);

      setStatus(res.data);
      console.log(stats);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-white to-gray-50 flex items-center overflow-hidden">
        <div className="w-full">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full text-sm text-indigo-600">
                  <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
                  <span className="hidden sm:inline">
                    Smart inventory management platform
                  </span>
                  <span className="sm:hidden">Smart Inventory Platform</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Transform your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    inventory control
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600">
                  Streamline operations, reduce costs, and gain real-time
                  insights with Invenio's intelligent inventory management
                  solution.
                </p>

                <div>
                  <Link to="/products">
                    <span className="inline-flex items-center px-6 sm:px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all transform hover:translate-y-[-2px] shadow-sm hover:shadow">
                      Explore
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t">
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <BoxIcon className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Products Managed</span>
                      <span className="sm:hidden">Products</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stats.total_products}+
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Active Users</span>
                      <span className="sm:hidden">Users</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stats.total_users}+
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8 transform -rotate-3 transition-transform hover:rotate-0">
                  {/* Dashboard Preview */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-8 w-32 bg-indigo-50 rounded"></div>
                      <div className="h-8 w-8 bg-indigo-50 rounded-full"></div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                        <div className="h-4 w-16 bg-white/60 rounded mb-2"></div>
                        <div className="h-6 w-24 bg-white/80 rounded"></div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <div className="h-4 w-16 bg-white/60 rounded mb-2"></div>
                        <div className="h-6 w-24 bg-white/80 rounded"></div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="h-32 bg-gray-50 rounded-lg overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50"></div>
                    </div>

                    {/* Table */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                          </div>
                          <div className="w-16 h-4 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
