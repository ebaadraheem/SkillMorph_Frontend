import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

interface CreatorDashboardProps {
  creatorId: string;
  creatorEmail: string;
}

interface Balance {
  available: Array<{ amount: number; currency: string }>;
  pending: Array<{ amount: number; currency: string }>;
}

interface Payment {
  id: string;
  created: number;
  amount: number;
  status: string;
  fee: number;
  currency: string;
  metadata?: {
    platformFee?: number;
  };
}

interface Payout {
  id: string;
  created: number;
  amount: number;
  status: string;
  currency: string;
  fee: number;
}

interface StripeAccountResponse {
  success: boolean;
  message?: string;
  accountLink?: string;
  accountId?: string;
  isActive?: boolean;
  pendingRequirements?: string[];
  error?: string;
  details?: string;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  creatorId,
  creatorEmail,
}) => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountLink, setAccountLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingRequirements, setPendingRequirements] = useState<string[]>([]);

  useEffect(() => {
    if (!creatorId) {
      setError("Creator ID is required");
      setLoading(false);
      return;
    }
    checkOrCreateStripeAccount();
  }, [creatorId]);

  const checkOrCreateStripeAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post<StripeAccountResponse>(
        `${API_BASE_URL}/payment/create-or-fetch-connect-account`,
        { creatorId, creatorEmail }
      );

      const {
        success,
        message,
        accountLink: newAccountLink,
        accountId,
        isActive,
        pendingRequirements: requirements,
      } = response.data;
      if (!success) {
        setMessage(message || "");
        if (newAccountLink) {
          setAccountLink(newAccountLink);
        }
        if (requirements) {
          setPendingRequirements(requirements);
        }
        return;
      }
      if (isActive && accountId) {
        await fetchDashboardData(accountId);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to setup Stripe account"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (accountId: string) => {
    try {
      setError(null);
      const [balanceRes, payoutsRes, paymentsRes] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/payment/balance/${accountId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "skip-browser-warning",
            },
            credentials: "include",
          }
        ).then((res) => res.json()),

        fetch(
          `${import.meta.env.VITE_SERVER_URL}/payment/payouts/${accountId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "skip-browser-warning",
            },
            credentials: "include",
          }
        ).then((res) => res.json()),

        fetch(
          `${import.meta.env.VITE_SERVER_URL}/payment/payments/${accountId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "skip-browser-warning",
            },
            credentials: "include",
          }
        ).then((res) => res.json()),
      ]);

      if (!balanceRes.success || !payoutsRes.success || !paymentsRes.success) {
        throw new Error("Failed to fetch dashboard data");
      }
      setBalance(balanceRes.data);
      setPayouts(payoutsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    }
  };

  const requestPayout = async () => {
    if (!balance?.available?.[0]?.amount || !creatorId) return;

    try {
      setError(null);
      await axios.post(`${API_BASE_URL}/payment/payout`, {
        accountId: creatorId,
        amount: balance.available[0].amount,
      });
      await fetchDashboardData(creatorId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payout");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[74vh] items-center justify-center p-8">
        <img className="w-8 h-8 animate-spin" src="loading.svg" alt="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (pendingRequirements.length > 0) {
    return (
      <div className="p-6 flex flex-col h-[74vh] bg-orange-500 text-center">
        <h2 className="text-xl font-semibold mb-4">Verification Required</h2>
        <p className="text-gray-600 mb-4">
          Please complete the following verification requirements:
        </p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto">
          {pendingRequirements.map((req, index) => (
            <li key={index} className="text-gray-600 mb-2">
              {req}
            </li>
          ))}
        </ul>
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    );
  }

  if (accountLink) {
    return (
      <div className="p-6 flex flex-col h-[74vh]  flexer text-center">
        <h2 className="text-xl font-semibold mb-4">
          Complete Your Payment Account Setup
        </h2>
        <a
          href={accountLink}
          rel="noopener noreferrer"
          className="cursor-pointer bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          Complete Onboarding
        </a>
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    );
  }

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto "
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Balance Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Balance</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Available</p>
            <p className="text-2xl font-bold">
              ${((balance?.available?.[0]?.amount || 0) / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Pending</p>
            <p className="text-2xl font-bold">
              ${((balance?.pending?.[0]?.amount || 0) / 100).toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={requestPayout}
          disabled={!balance?.available?.[0]?.amount}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Request Payout"}
        </button>
      </div>
      {/* Transaction Tables */}
      {[
        { title: "Recent Payments", data: payments || [], type: "payment" },
        { title: "Payout History", data: payouts || [], type: "payout" },
      ].map(({ title, data, type }) => (
        <div
          key={type}
          className="bg-white rounded-lg shadow p-6 mb-8 last:mb-0"
        >
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  {type === "payment" && (
                    <th className="text-left py-2">Fee</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={type === "payment" ? 4 : 3}
                      className="py-4 text-center text-gray-500"
                    >
                      No {type}s found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">
                        {new Date(item.created * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        ${(item.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-2">{item.status}</td>
                      {type === "payment" && (
                        <td className="py-2">
                          ${((item.fee || 0) / 100).toFixed(2)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default CreatorDashboard;
