
import { useRouter } from 'next/router';

const templateMap = {
  arts_creativity: require('../templates/arts_creativity/preview.jsx').default,
  business_career: require('../templates/business_career/preview.jsx').default,
  education_learning: require('../templates/education_learning/preview.jsx').default,
  entertainment_pop: require('../templates/entertainment_pop/preview.jsx').default,
  health_wellness: require('../templates/health_wellness/preview.jsx').default,
  lifestyle_personal_dev: require('../templates/lifestyle_personal_dev/preview.jsx').default,
  science_tech: require('../templates/science_tech/preview.jsx').default,
  society_worldview: require('../templates/society_worldview/preview.jsx').default,
  practical_living: require('../templates/practical_living/preview.jsx').default,
  church: require('../templates/church/preview.jsx').default,
  ministry: require('../templates/ministry/preview.jsx').default,
  podcast: require('../templates/podcast/preview.jsx').default,
  devotional: require('../templates/devotional/preview.jsx').default,
  magazine: require('../templates/magazine/preview.jsx').default,
  news_blog_cnn: require('../templates/news_blog_cnn/preview.jsx').default,
  tv_blog_bloomberg: require('../templates/tv_blog_bloomberg/preview.jsx').default
};

export default function DemoPreview() {
  const { query } = useRouter();
  const TemplateComponent = templateMap[query.templateId];

  return (
    <div className="min-h-screen bg-gray-100">
      {TemplateComponent ? <TemplateComponent /> : <p className="text-center mt-10 text-red-500">Preview not found.</p>}
    </div>
  );
}
