import React from 'react'
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

const PaginationElement = ({ areas, totalDocuments, perPageItem, handlePageClick, currentPage }) => {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-5">
        <div className="dataTables_info">
          Showing {Math.min(totalDocuments, perPageItem * (currentPage - 1) + 1)} to{" "}
          {Math.min(totalDocuments, perPageItem * currentPage)} of {totalDocuments} entries
        </div>
      </div>

      <div className="col-sm-12 col-md-7">
        <div className="d-flex justify-content-end align-items-center">
          <div className="dataTables_paginate paging_full_numbers">
            <ReactPaginate
              forcePage={currentPage - 1}
              pageCount={Math.ceil(totalDocuments / perPageItem)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              onPageChange={handlePageClick}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </div>

  )
}

export default PaginationElement