import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useState } from 'react';

type Props = {};

const index = (props: Props) => {
  const [periodDay, setPeriodDay] = useState('Mon');

  const [itemsAddSubject, setItemsAddSubject] = useState([
    {
      class: '',
      periods: [
        {
          day: periodDay,
          number: '',
          subject: '',
          teacher: '',
          pleace: '',
        },
      ],
    },
  ]);

  const addClass = () => {
    setItemsAddSubject([
      ...itemsAddSubject,
      {
        class: '',
        periods: [
          {
            day: periodDay,
            number: '',
            subject: '',
            teacher: '',
            pleace: '',
          },
        ],
      },
    ]);
  };

  const [itemsAddPeriod, setItemsAddPeriod] = useState([{}]);

  const addPeriod = (index: number) => {
    const updatedData = [...itemsAddSubject];
    updatedData[index].periods.push({
      day: periodDay,
      number: '',
      subject: '',
      teacher: '',
      pleace: '',
    });
    setItemsAddSubject(updatedData);
  };

  const remove = (index: number, linkIndex: number) => {
    const updatedData = [...itemsAddSubject];
    updatedData[index].periods.splice(linkIndex, 1);
    setItemsAddSubject(updatedData);
  };
  console.log(itemsAddSubject);

  return (
    <>
      <div>
        <button className="btn btn-primary" onClick={addClass}>
          Add new class
        </button>
        <form action="">
          {itemsAddSubject.map((itemsAddSubjects: any, index: number) => (
            <div key={index} className="mt-2 ">
              <div className="panel m-2 ">
                <div className="flex justify-between">
                  <input className="form-input w-[200px]" type="text" />
                  <ToggleButtonGroup style={{ height: '40px' }} value={periodDay} onChange={(e, v) => v && setPeriodDay(v)} exclusive>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <ToggleButton value={day} key={day}>
                        {day}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <div
                    className="btn btn-primary inline-block"
                    onClick={() => {
                      addPeriod(index);
                    }}
                  >
                    Add a Period
                  </div>
                </div>

                <div className="py-4">
                  {itemsAddSubjects.periods.map((period: any, i: any) =>
                    period.day === periodDay ? (
                      <div key={`period-${i}`}>
                        <div className="flex gap-2 py-2">
                          <input
                            className="form-input "
                            type="text"
                            onChange={(e) => {
                              const updatedData = [...itemsAddSubject];
                              updatedData[index].periods[i].number = e.target.value;
                              setItemsAddSubject(updatedData);
                            }}
                          />
                          <input
                            className="form-input "
                            type="text"
                            onChange={(e) => {
                              const updatedData = [...itemsAddSubject];
                              updatedData[index].periods[i].subject = e.target.value;
                              setItemsAddSubject(updatedData);
                            }}
                          />
                          <input
                            className="form-input "
                            type="text"
                            onChange={(e) => {
                              const updatedData = [...itemsAddSubject];
                              updatedData[index].periods[i].teacher = e.target.value;
                              setItemsAddSubject(updatedData);
                            }}
                          />
                          <input
                            className="form-input "
                            type="text"
                            onChange={(e) => {
                              const updatedData = [...itemsAddSubject];
                              updatedData[index].periods[i].pleace = e.target.value;
                              setItemsAddSubject(updatedData);
                            }}
                          />
                          <button type="button" className="ml-2 mt-2 flex hover:text-danger" onClick={() => remove(index, i)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                              <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path
                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              ></path>
                              <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path
                                opacity="0.5"
                                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-success" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default index;
