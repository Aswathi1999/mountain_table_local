import { RoomsCards } from "@/components/sections/rooms/RoomsCards";
import { RoomsIntro } from "@/components/sections/rooms/RoomsIntro";
import { RoomsPolicies } from "@/components/sections/rooms/RoomsPolicies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/rooms-booking");

export default function RoomsBookingPage() {
  return (
    <div className="rooms-page">
      <RoomsIntro />
      <RoomsCards />
      <RoomsPolicies />
    </div>
  );
}
