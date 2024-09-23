import React from 'react';

interface JobSelectorProps {
  jobCategories: { name: string; value: string; hoverClass: string }[];
  selectedJob: string;
  onSelectJob: (jobValue: string) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({ jobCategories, selectedJob, onSelectJob }) => {
  return (
    <>
      {/* 큰 화면용 */}
      <ul className="hidden lg:block job-list rounded-2xl bg-fillStrong">
        {jobCategories.map((job, index) => (
          <li
            key={job.value}
            className={`job-item 
              ${selectedJob === job.value ? 'bg-primary text-black font-bold' : ''} 
              ${job.hoverClass} text-center rounded-lg p-2 transition-all duration-300 
              ${index < jobCategories.length - 1}`} 
            onClick={() => onSelectJob(job.value)}
          >
            {job.name}
          </li>
        ))}
      </ul>

      {/* 작은 화면용 */}
      <div className="block lg:hidden">
        <select
          className="p-2 text-xl bg-black text-white rounded-lg w-full border border-gray-500 transition-all duration-300 ease-in-out focus:border-blue-500 focus:bg-gray-800 hover:bg-gray-900"
          value={selectedJob}
          onChange={(e) => onSelectJob(e.target.value)}
        >
          {jobCategories.map((job) => (
            <option key={job.value} value={job.value}>
              {job.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default JobSelector;