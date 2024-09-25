import React from 'react';
import Pagination from 'rc-pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type PaginationComponentProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onChange,
}) => {
  const renderBtn = (current: number, type: string, element: React.ReactNode) => {
    if (type === 'prev' || type === 'next') {
      const arrowBtnClassName =
        'text-[#969696] group-hover:text-white transition-colors duration-300';
      return (
        <button
          type="button"
          className={`flex flex-wrap justify-center content-center w-[36px] h-[36px] rounded cursor-pointer transition-all duration-300 hover:bg-[#2979ff] group`}
        >
          {type === 'prev' ? (
            <FaChevronLeft className={arrowBtnClassName} size={14} />
          ) : (
            <FaChevronRight className={arrowBtnClassName} size={14} />
          )}
        </button>
      );
    }

    if (type === 'page') {
      return (
        <button
          type="button"
          className={`w-[36px] h-[36px] rounded cursor-pointer transition-all duration-300 hover:bg-[#2979ff] hover:text-white ${
            currentPage === current
              ? 'w-[40px] h-[40px] bg-[#2979ff] text-white'
              : 'bg-transparent text-[#969696]'
          }`}
          onClick={() => onChange(current)}
        >
          {current}
        </button>
      );
    }

    return element;
  };

  return (
    <Pagination
      className="flex flex-wrap justify-center content-center pt-7"
      current={currentPage}
      total={totalItems}
      pageSize={pageSize}
      showTitle={false}
      onChange={onChange}
      itemRender={renderBtn}
    />
  );
};

export default PaginationComponent;
