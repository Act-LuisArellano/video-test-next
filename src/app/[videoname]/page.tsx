export default function Page({ params }: { params: { videoname: string } }) {
  return (
    <div className="flex h-screen justify-center items-center">
      <video controls width="800" height="450">
        <source src={`/videos/${params.videoname}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
