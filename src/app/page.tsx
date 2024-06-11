import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import Link from "next/link";

async function handler() {
  const videoDirectory = path.join(process.cwd(), "public/videos");

  try {
    const files = fs.readdirSync(videoDirectory);
    const videoData = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(videoDirectory, file);
          ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
              return reject(err);
            }
            const { size } = fs.statSync(filePath);
            const duration = metadata.format.duration;
            resolve({
              id: Math.floor(Math.random() * 1000),
              name: file.split(".")[0],
              size: (size / (1024 * 1024 * 1024)).toFixed(2), // size in GB
              duration: (duration ?? 0 / 3600).toFixed(2), // duration in hours
            });
          });
        });
      })
    );
    return videoData as Video[];
  } catch (error: any) {
    return [];
  }
}

interface Video {
  id: number;
  name: string;
  size: string;
  duration: string;
}

export default async function Home() {
  const videos: Video[] = await handler();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-8xl font-bold mb-12">Video List</h1>
        {videos.length > 0 ? (
          <ul className="grid grid-cols-2">
            {videos.map((video, index) => (
              <li key={index} className="mb-2">
                <Link href={`/${video.name}`}>
                  <p>Name: {video.name}</p>
                  <p>Size: {video.size} GB</p>
                  <p>
                    Duration: {(Number(video.duration) / 60).toFixed(2)} minutes
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading videos...</p>
        )}
      </div>
    </main>
  );
}
