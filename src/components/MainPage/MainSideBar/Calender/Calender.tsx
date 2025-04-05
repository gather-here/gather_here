// "use client";

// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import listPlugin from "@fullcalendar/list";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useQuery } from "@tanstack/react-query";
// import dayjs from "dayjs";
// import { useEffect, useRef, useState } from "react";
// import "./fullcalender.css";
// import { NextPage } from "next";
// import { Tables } from "@/types/supabase";
// import CalenderLoader from "@/components/Common/Skeleton/CalenderLoader";
// import Image from "next/image";

// const detectMobileDevice = () => {
//   const width = 1068;

//   return window.innerWidth < width;
// };

// const Calender: NextPage = () => {
//   const calenderRef = useRef<FullCalendar | null>(null);
//   const [isGrid, setIsGrid] = useState(true);
//   const [isMobileDevice, setIsMobileDevice] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       const isMobileDevice = detectMobileDevice();
//       setIsMobileDevice(isMobileDevice);
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const getEvents = async () => {
//     try {
//       const response = await fetch("/api/events");

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }

//       const { data } = await response.json();

//       const events = data.map((event: Tables<"IT_Events">) => ({
//         title: event.title,
//         start: dayjs(event.date_start).format("YYYY-MM-DD"),
//         end: dayjs(event.date_done).format("YYYY-MM-DD"),
//         description: event.location,
//       }));

//       return events;
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//       throw new Error("이벤트를 불러오는 데 문제가 발생했습니다.");
//     }
//   };

//   let {
//     data: IT_Events,
//     isPending,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["IT_Events"],
//     queryFn: getEvents,
//   });

//   if (isPending) {
//     return <CalenderLoader />;
//   } else if (isError) {
//     console.error(error);
//     return <div>로딩 실패했습니다..</div>;
//   }

//   return (
//     <div className="custom_calender mb-6">
//       <h4 className="flex text-labelNormal mb-3">
//         <Image
//           src="/assets/gif/hot.webp"
//           alt="fire Icon"
//           width={20}
//           height={20}
//           className="mr-1"
//           style={{ width: "20px", height: "20px" }}
//         />
//         HOT한 IT 행사 놓치지 마세요
//       </h4>
//       <FullCalendar
//         aspectRatio={0.678}
//         customButtons={{
//           viewChanger: {
//             click() {
//               if (isGrid) {
//                 calenderRef.current?.getApi().changeView("listMonth");
//                 setIsGrid(false);
//               } else {
//                 calenderRef.current?.getApi().changeView("dayGridMonth");
//                 setIsGrid(true);
//               }
//             },
//           },
//         }}
//         plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
//         ref={calenderRef}
//         // initialView={`${isMobileDevice ? "listMonth" : "dayGridMonth"}`}
//         initialView="listMonth"
//         locale="ko"
//         events={IT_Events}
//         headerToolbar={
//           // isMobileDevice
//           // ? {
//           //     start: "prev",
//           //     center: "title",
//           //     end: "next",
//           //   }
//           // : { start: "title", end: "prev next viewChanger" }
//           {
//             start: "prev",
//             center: "title",
//             end: "next",
//           }
//         }
//         titleFormat={(date) => {
//           return date.date.year + ". " + String(date.date.month + 1).padStart(2, "0") + ".";
//         }}
//         dayMaxEventRows={0}
//         dayCellContent={(cellContent) => {
//           return cellContent.dayNumberText.replace("일", "");
//         }}
//         firstDay={1}
//         moreLinkContent={(arg) => {
//           return arg.shortText;
//         }}
//         windowResize={() => {
//           if (isMobileDevice) {
//             calenderRef.current?.getApi().changeView("listMonth");
//           } else {
//             calenderRef.current?.getApi().changeView("dayGridMonth");
//           }
//         }}
//         allDayText=""
//         displayEventTime={false}
//         eventDisplay="list-item"
//         eventContent={(arg) => {
//           const title = document.createElement("div");
//           title.classList.add("fc-event-title");
//           title.textContent = arg.event.title;

//           const description = document.createElement("div");
//           description.classList.add("fc-event-description");
//           description.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M4.99996 0C6.30978 0 7.56595 0.520324 8.49213 1.44651C9.41831 2.37269 9.93864 3.62886 9.93864 4.93868C9.93864 7.02559 8.47223 9.29991 5.5774 11.786C5.41644 11.9242 5.21121 12.0002 4.99901 12C4.78681 11.9998 4.58172 11.9235 4.42099 11.785L4.22952 11.6188C1.46285 9.19759 0.0612793 6.97899 0.0612793 4.93868C0.0612793 3.62886 0.581603 2.37269 1.50778 1.44651C2.43397 0.520324 3.69014 0 4.99996 0ZM4.99996 3.03919C4.49618 3.03919 4.01304 3.23931 3.65681 3.59554C3.30059 3.95176 3.10047 4.4349 3.10047 4.93868C3.10047 5.44245 3.30059 5.9256 3.65681 6.28182C4.01304 6.63805 4.49618 6.83817 4.99996 6.83817C5.50374 6.83817 5.98688 6.63805 6.3431 6.28182C6.69933 5.9256 6.89945 5.44245 6.89945 4.93868C6.89945 4.4349 6.69933 3.95176 6.3431 3.59554C5.98688 3.23931 5.50374 3.03919 4.99996 3.03919Z" fill="#919191" fill-opacity="0.32"/>
//           </svg> ${arg.event.extendedProps.description}`;

//           const arrayOfDomNodes = [title, description];

//           return { domNodes: arrayOfDomNodes };
//         }}
//       />
//     </div>
//   );
// };

// export default Calender;
