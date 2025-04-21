// /components/Courses/SingleCourse.tsx
import { Course } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';

const SingleCourse = ({ course }: { course: Course }) => {
  const { title, image, description, instructor, plateforme, publishDate } = course;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-dark dark:hover:shadow-gray-dark">
      <Link href="/blog-details" className="relative block aspect-[37/22] w-full">
        <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
          {plateforme}
        </span>
        <Image src={image} alt={title} fill className="object-cover" />
      </Link>
      <div className="p-6 sm:p-8">
        <h3>
          <Link
            href="/blog-details"
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {title}
          </Link>
        </h3>
        <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-full mr-4">
              <Image src={instructor.image} alt={instructor.name} fill />
            </div>
            <div>
              <h4 className="text-sm font-medium text-dark dark:text-white">{instructor.name}</h4>
              <p className="text-xs text-body-color">{instructor.bio}</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="text-sm font-medium text-dark dark:text-white">Date</h4>
            <p className="text-xs text-body-color">{publishDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourse;
