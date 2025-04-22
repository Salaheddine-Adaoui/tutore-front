import SectionTitle from '../Common/SectionTitle';
import SingleCourse from './SingleCourse'; // anciennement SingleBlog
import courseData from './courseData'; // anciennement blogData

const Courses = () => {
  return (
    <section
      id="formations"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Nos dernières formations"
          paragraph="Découvrez une sélection des cours en ligne les plus récents pour booster vos compétences."
          center
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {courseData.map((course) => (
            <div key={course.id} className="w-full">
              <SingleCourse course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
