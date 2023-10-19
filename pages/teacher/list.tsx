import React from 'react';

type Props = {};

const list = (props: Props) => {
  return (
    <div className="panel h-full overflow-hidden border-0 p-0">
      <div className="min-h-[190px] bg-gradient-to-r from-[#4361ee] to-[#160f6b] p-6">
        <div className="mb-6 flex items-center justify-between"></div>
        <div className="flex items-center justify-between text-white">
          <p className="text-xl">Wallet Balance</p>
          <h5 className="text-2xl ltr:ml-auto rtl:mr-auto">
            <span className="text-white-light">$</span>2953
          </h5>
        </div>
      </div>
      <div className="-mt-12 grid grid-cols-2 gap-2 px-8">
        <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
          <span className="mb-4 flex items-center justify-between dark:text-white">
            Received
            <svg className="h-4 w-4 text-success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 15L12 9L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">$97.99</div>
        </div>
        <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
          <span className="mb-4 flex items-center justify-between dark:text-white">
            Spent
            <svg className="h-4 w-4 text-danger" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">$53.00</div>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-5">
          <span className="rounded-full bg-[#1b2e4b] px-4 py-1.5 text-xs text-white before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white ltr:before:mr-2 rtl:before:ml-2">
            Pending
          </span>
        </div>
        <div className="mb-5 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#515365]">Netflix</p>
            <p className="text-base">
              <span>$</span> <span className="font-semibold">13.85</span>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#515365]">BlueHost VPN</p>
            <p className="text-base">
              <span>$</span> <span className="font-semibold ">15.66</span>
            </p>
          </div>
        </div>
        <div className="flex justify-around px-2 text-center">
          <button type="button" className="btn btn-secondary ltr:mr-2 rtl:ml-2">
            View Details
          </button>
          <button type="button" className="btn btn-success">
            Pay Now $29.51
          </button>
        </div>
      </div>
    </div>
  );
};

export default list;
