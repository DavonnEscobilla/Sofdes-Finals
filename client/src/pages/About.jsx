export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About PsyKitz Blogs!
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to PsyKitz!
            </p>

            <p>
              On this platform, you'll find weekly articles and tutorials on topics
              about programming using flow charts!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other people. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
