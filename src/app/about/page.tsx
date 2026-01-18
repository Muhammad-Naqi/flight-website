import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about Flight Travel Agency and our mission to provide exceptional travel experiences.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        About Flight Travel Agency
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
          Welcome to Flight Travel Agency, your trusted partner in creating unforgettable travel
          experiences.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 mb-6">
          At Flight Travel Agency, we believe that travel is more than just visiting new
          places—it&apos;s about creating memories, experiencing different cultures, and broadening
          your horizons. Our mission is to make travel accessible, enjoyable, and memorable for
          everyone.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">
          What We Offer
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Curated travel packages to destinations worldwide</li>
          <li>Expert travel advice and destination guides</li>
          <li>Competitive pricing and exclusive deals</li>
          <li>24/7 customer support</li>
          <li>Travel insurance and assistance</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-700 mb-6">
          With years of experience in the travel industry, we&apos;ve built a reputation for
          reliability, excellent service, and customer satisfaction. Our team of travel experts is
          dedicated to helping you plan the perfect trip, whether you&apos;re looking for a relaxing
          beach vacation, an adventurous mountain trek, or a cultural city tour.
        </p>

        <div className="bg-primary-50 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <p className="text-gray-800 font-medium">
            Ready to start your next adventure? Contact us today and let&apos;s make your travel
            dreams come true!
          </p>
        </div>
      </div>
    </div>
  );
}
