import { useState } from "react";
import axios from "axios";
import LearnMore from "./LearnMore";
import { loadStripe } from "@stripe/stripe-js";
import { useAuthenticationStore } from "../store/AuthStore";
import { GetDuration } from "./Components";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  thumbnail?: string;
  price?: string;
  duration?: number;
  is_enrolled?: boolean;
  stripe_account_id?: string;
}

const EnrollCard = ({
  id,
  title,
  description,
  category,
  instructor,
  thumbnail,
  price,
  duration,
  is_enrolled,
  stripe_account_id,
}: Course) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthenticationStore();

  const handleEnrollClick = async () => {
    if (!user) {
      toast.error("Please log in to enroll in courses");
      return;
    }
    if (!price) {
      setError("Missing required payment information");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/payment/process-payment`,
        {
          courseId: id,
          amount: parseFloat(price),
          creatorConnectId: stripe_account_id,
          student_id: user?.user_id,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Payment initialization failed");
      }

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      // Redirect to Stripe Checkout
      const { sessionId } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment initialization failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md  transition-shadow flex flex-col">
      <div className="flex-grow">
        {thumbnail && (
          <div className="mb-4">
            <img
              src={thumbnail}
              alt={`${title} Thumbnail`}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <h3 className="text-xl font-bold text-[#3B82F6]">{title}</h3>
        <p className="text-[#6B7280] mt-2">By {instructor}</p>
        <p className="text-[#111827] mt-2 line-clamp-3">{description}</p>

        {duration ? (
          <p className="mt-2 text-sm text-[#6B7280]">
            Duration: {GetDuration(duration)}
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#6B7280]">Duration: 0s</p>
        )}

        {price && (
          <p className="mt-2 text-lg font-semibold text-[#3B82F6]">${price}</p>
        )}

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {is_enrolled ? (
          <button
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg"
            disabled
          >
            Enrolled
          </button>
        ) : (
          <button
            onClick={handleEnrollClick}
            disabled={isProcessing}
            className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isProcessing ? (
              <img
                className=" w-6 h-6 animate-spin "
                src="loading.svg"
                alt=""
              />
            ) : (
              "Enroll Now"
            )}
          </button>
        )}
        <button
          onClick={() =>
            setSelectedCourse({
              id,
              title,
              description,
              category,
              instructor,
              thumbnail,
              price,
              duration,
              stripe_account_id,
            })
          }
          className="text-[#3B82F6] hover:underline"
        >
          Learn More
        </button>
      </div>

      {selectedCourse && (
        <LearnMore
          {...selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default EnrollCard;
