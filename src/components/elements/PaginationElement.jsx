import React from 'react'
import ReactPaginate from 'react-paginate';

const PaginationElement = ({ areas, totalDocuments, perPageItem, handlePageClick, currentPage }) => {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-12">
        <div className="pagi_mainBoxFlex">
        <div className="dataTables_info">
          Showing {Math.min(totalDocuments, perPageItem * (currentPage - 1) + 1)} to{" "}
          {Math.min(totalDocuments, perPageItem * currentPage)} of {totalDocuments} entries
        </div>
          <div className="dataTables_paginate paging_full_numbers">
            <ReactPaginate
              forcePage={currentPage - 1}
              pageCount={Math.ceil(totalDocuments / perPageItem)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              previousLabel={<svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.8621 12.0754L2.28676 6.50004L7.86207 0.924735C8.07385 0.712954 8.07385 0.370616 7.86207 0.158836C7.65029 -0.0529452 7.30795 -0.0529452 7.09617 0.158836L1.1379 6.11711C0.92612 6.32889 0.92612 6.67123 1.1379 6.88301L7.09617 12.8413C7.2018 12.9469 7.34045 13 7.47913 13C7.61779 13 7.75647 12.9469 7.8621 12.8413C8.07388 12.6295 8.07388 12.2872 7.8621 12.0754Z" fill="currentcolor"/>
                </svg>
              }
              nextLabel={<svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.86208 6.11712L1.9038 0.158836C1.69202 -0.0529453 1.34968 -0.0529453 1.1379 0.158836C0.92612 0.370617 0.92612 0.712955 1.1379 0.924737L6.71322 6.50006L1.1379 12.0754C0.92612 12.2872 0.92612 12.6295 1.1379 12.8413C1.24352 12.9469 1.38218 13 1.52086 13C1.65952 13 1.7982 12.9469 1.90383 12.8413L7.86211 6.88299C8.07387 6.67124 8.07387 6.3289 7.86208 6.11712Z" fill="currentcolor" />
              </svg>
              }
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