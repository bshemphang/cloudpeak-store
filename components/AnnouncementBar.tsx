const announcements = [
  'FREE PAN-INDIA SHIPPING ON ORDERS ABOVE ₹999',
  'NEW 2026 DROP — LIMITED STOCK',
  'PREMIUM STREETWEAR & FOOTWEAR',
  '15-DAY HASSLE-FREE RETURNS',
  'NEW APPAREL DROPS WEEKLY',
];

export default function AnnouncementBar() {
  const content = announcements.map((text) => (
    <span key={text} className="flex items-center gap-3 shrink-0">
      <span className="text-summitGold">◆</span>
      <span>{text}</span>
    </span>
  ));

  return (
    <div className="w-full bg-midnightNavyDark text-summitGold overflow-hidden py-2.5 border-b border-summitGold/20">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map((group) => (
          <div key={group} className="flex items-center gap-10 px-5 shrink-0">
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
