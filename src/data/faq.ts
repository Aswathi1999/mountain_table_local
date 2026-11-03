/**
 * Frequently asked questions for the home page. Every answer restates what the Rooms & Booking page already says (see
 * `src/data/policies.ts`); nothing here adds a rule, time, price or amenity. Edit this list to change, reorder or add questions.
 */
export type Faq = { question: string; answer: string };

export const faqs: readonly Faq[] = [
  {
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is at 14:00 and check-out is at 11:00 (IST). Early check-in and late check-out are subject to availability, must be requested beforehand and are chargeable. All guests must share a valid ID proof at check-in.",
  },
  {
    question: "Is breakfast included?",
    answer:
      "Yes. Complimentary breakfast is provided, and guests can select up to three main courses from the food menu. We ask guests to confirm their food choices two days before arrival.",
  },
  {
    question: "How is a booking confirmed?",
    answer:
      "Bookings are confirmed only upon receipt of the advance payment. The balance payment is completed at check-in. On weekends (Friday, Saturday and Sunday) we prioritise full-property bookings.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancelling at least 7 days before arrival returns 90% of the advance amount, and at least 3 days before returns 50%. Cancellations within 3 days of arrival are not refunded, and reservations cancelled between 20 December and 10 January are not eligible for any refund.",
  },
  {
    question: "Are jeep safaris and trekking included?",
    answer:
      "Jeep safari and trekking activities are subject to availability, should be requested during the booking process and incur additional charges.",
  },
  {
    question: "Can we bring outside food or pets?",
    answer:
      "For the health, safety and quality standards of our guests, we do not permit outside food on the property, and food and beverages are served only in designated areas. Our homestay is not pet-friendly.",
  },
];
