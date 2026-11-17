/**
 * Frequently asked questions for the home page, also published as FAQPage structured data. Edit this list to change, reorder or add
 * questions. (Check-in times, payments and cancellation terms are on the Rooms & Booking page, `src/data/policies.ts`.)
 */
export type Faq = { question: string; answer: string };

export const faqs: readonly Faq[] = [
  {
    question: "Where is the Mountain Table located?",
    answer: "The Mountain Table is a family homestay hidden in the beautiful hills of Uluppuni, Vagamon, Kerala.",
  },
  {
    question: "What facilities are available at The Mountain Table?",
    answer:
      "The Mountain Table, as a homestay in Vagamon, offers comfortable rooms with an infinity pool. The wide views of the hills, premium dining, and unlimited access to scenic views. We also provide BBQ evenings and music. We can also arrange jeep safaris and trekking upon request, which will be charged separately.",
  },
  {
    question: "Does The Mountain Table have a swimming pool?",
    answer:
      "Yes. The Mountain Table is a homestay with a swimming pool in Vagamon. You can have a perfect vacation with your family or a weekend escape with us.",
  },
  {
    question: "What activities can guests enjoy during their stay at The Mountain Table?",
    answer:
      "There will be a BBQ evening with music, which could be arranged within The Mountain Table. For outside activities we can arrange trekking, jeep safaris, tea plantation walks, and other walks upon the request.",
  },
  {
    question: "Is The Mountain Table suitable for a family vacation?",
    answer:
      "Of course. The Mountain Table is a family-friendly homestay in Vagamon. We offer comfortable accommodation and activities that you can explore as a family.",
  },
];
