const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  const cameras = await prisma.camera.createMany({
    data: [
      { name: "Shop Floor A", location: "Shop Floor Camera A" },
      { name: "Vault", location: "Vault Camera" },
      { name: "Entrance", location: "Entrance Camera" },
    ],
    
  });


  const allCameras = await prisma.camera.findMany();


  const incidentsData = [
   
    {
      cameraId: allCameras[0].id,
      type: "Unauthorised Access",
      tsStart: new Date("2025-07-22T01:15:00Z"),
      tsEnd:   new Date("2025-07-22T01:17:00Z"),
      thumbnailUrl: "/thumbnails/unauth1.jpg",
    },
    {
      cameraId: allCameras[1].id,
      type: "Unauthorised Access",
      tsStart: new Date("2025-07-22T05:30:00Z"),
      tsEnd:   new Date("2025-07-22T05:32:00Z"),
      thumbnailUrl: "/thumbnails/unauth2.jpg",
    },
    // 3-4: Gun Threat
    {
      cameraId: allCameras[0].id,
      type: "Gun Threat",
      tsStart: new Date("2025-07-22T09:45:00Z"),
      tsEnd:   new Date("2025-07-22T09:47:00Z"),
      thumbnailUrl: "/thumbnails/gun1.jpg",
    },
    {
      cameraId: allCameras[2].id,
      type: "Gun Threat",
      tsStart: new Date("2025-07-22T14:10:00Z"),
      tsEnd:   new Date("2025-07-22T14:12:00Z"),
      thumbnailUrl: "/thumbnails/gun2.jpg",
    },
    // 5-6: Face Recognised
    {
      cameraId: allCameras[1].id,
      type: "Face Recognised",
      tsStart: new Date("2025-07-22T08:00:00Z"),
      tsEnd:   new Date("2025-07-22T08:00:05Z"),
      thumbnailUrl: "/thumbnails/face1.jpg",
    },
    {
      cameraId: allCameras[2].id,
      type: "Face Recognised",
      tsStart: new Date("2025-07-22T16:30:00Z"),
      tsEnd:   new Date("2025-07-22T16:30:05Z"),
      thumbnailUrl: "/thumbnails/face2.jpg",
    },
  
    {
      cameraId: allCameras[2].id,
      type: "Traffic Congestion",
      tsStart: new Date("2025-07-22T10:20:00Z"),
      tsEnd:   new Date("2025-07-22T10:25:00Z"),
      thumbnailUrl: "/thumbnails/traffic1.jpg",
    },
    // 8: Smoke Detected
    {
      cameraId: allCameras[0].id,
      type: "Smoke Detected",
      tsStart: new Date("2025-07-22T18:05:00Z"),
      tsEnd:   new Date("2025-07-22T18:06:00Z"),
      thumbnailUrl: "/thumbnails/smoke1.jpg",
    },
   
    {
      cameraId: allCameras[1].id,
      type: "Crowd Detected",
      tsStart: new Date("2025-07-22T12:00:00Z"),
      tsEnd:   new Date("2025-07-22T12:05:00Z"),
      thumbnailUrl: "/thumbnails/crowd1.jpg",
    },
    
    {
      cameraId: allCameras[0].id,
      type: "Multiple Events",
      tsStart: new Date("2025-07-22T20:00:00Z"),
      tsEnd:   new Date("2025-07-22T20:10:00Z"),
      thumbnailUrl: "/thumbnails/multi1.jpg",
    },

    {
      cameraId: allCameras[2].id,
      type: "Suspicious Object",
      tsStart: new Date("2025-07-22T22:45:00Z"),
      tsEnd:   new Date("2025-07-22T22:47:00Z"),
      thumbnailUrl: "/thumbnails/object1.jpg",
    },
 
    {
      cameraId: allCameras[1].id,
      type: "Loitering",
      tsStart: new Date("2025-07-22T23:30:00Z"),
      tsEnd:   new Date("2025-07-22T23:35:00Z"),
      thumbnailUrl: "/thumbnails/loiter1.jpg",
    },
    // 13: Fire Alarm
    {
      cameraId: allCameras[0].id,
      type: "Fire Alarm",
      tsStart: new Date("2025-07-22T03:00:00Z"),
      tsEnd:   new Date("2025-07-22T03:02:00Z"),
      thumbnailUrl: "/thumbnails/fire1.jpg",
    },
    // 14: Vehicle Intrusion
    {
      cameraId: allCameras[1].id,
      type: "Vehicle Intrusion",
      tsStart: new Date("2025-07-22T06:45:00Z"),
      tsEnd:   new Date("2025-07-22T06:47:00Z"),
      thumbnailUrl: "/thumbnails/vehicle1.jpg",
    },

    {
      cameraId: allCameras[2].id,
      type: "Suspicious Activity",
      tsStart: new Date("2025-07-22T07:30:00Z"),
      tsEnd:   new Date("2025-07-22T07:35:00Z"),
      thumbnailUrl: "/thumbnails/suspicious1.jpg",
    },

    {
      cameraId: allCameras[0].id,
      type: "Face Unknown",
      tsStart: new Date("2025-07-22T13:10:00Z"),
      tsEnd:   new Date("2025-07-22T13:12:00Z"),
      thumbnailUrl: "/thumbnails/face_unknown1.jpg",
    },

    {
      cameraId: allCameras[1].id,
      type: "Crowd Gathering",
      tsStart: new Date("2025-07-22T15:50:00Z"),
      tsEnd:   new Date("2025-07-22T15:55:00Z"),
      thumbnailUrl: "/thumbnails/crowd2.jpg",
    },

    {
      cameraId: allCameras[2].id,
      type: "Object Left Behind",
      tsStart: new Date("2025-07-22T17:25:00Z"),
      tsEnd:   new Date("2025-07-22T17:27:00Z"),
      thumbnailUrl: "/thumbnails/object2.jpg",
    },
 
    {
      cameraId: allCameras[0].id,
      type: "Smoke Detected",
      tsStart: new Date("2025-07-22T19:40:00Z"),
      tsEnd:   new Date("2025-07-22T19:42:00Z"),
      thumbnailUrl: "/thumbnails/smoke2.jpg",
    },
  
    {
      cameraId: allCameras[1].id,
      type: "Glass Break",
      tsStart: new Date("2025-07-22T21:15:00Z"),
      tsEnd:   new Date("2025-07-22T21:17:00Z"),
      thumbnailUrl: "/thumbnails/glass1.jpg",
    },
  ];


  await prisma.incident.createMany({
    data: incidentsData,
    
  });

  console.log("🌱 Seed data created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
