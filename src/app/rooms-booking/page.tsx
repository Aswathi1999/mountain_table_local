import { RoomsHero } from "@/components/sections/rooms/RoomsHero";
import { RoomsList } from "@/components/sections/rooms/RoomsList";
import { RoomsPolicies } from "@/components/sections/rooms/RoomsPolicies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/rooms-booking");

export default function RoomsBookingPage() {
  return (
    <div className="rooms-page">
      <RoomsHero />
      <RoomsList />
      <RoomsPolicies />
    </div>
  );
}
