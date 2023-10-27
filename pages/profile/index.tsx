import { useRouter } from 'next/router';

import { useDeletePicMutation, useUpdatePasswordMutation, useUpdateProfileMutation } from '@/redux/features/user/userApi';
import { useAuth } from '../../pages/hooks/auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Props = {};

const index = (props: Props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
  const [deletePic, { isSuccess: successDelete }] = useDeletePicMutation();

  const router = useRouter();

  const handleDelete = async (e: any) => {
    e.preventDefault();
    console.log('hallo');
    const showAlert = async (type: number) => {
      if (type === 10) {
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonText: 'Delete',
          padding: '2em',
          customClass: 'sweet-alerts',
        }).then(async (result) => {
          if (result.value) {
            router.reload();
            await deletePic(data);
          }
        });
      }
    };
    showAlert(10);
  };

  const changePassword = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Password do not match');
    } else {
      // updatePassword({ oldPassword, newPassword });
      const showAlert = async (type: number) => {
        if (type === 10) {
          Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
          }).then((result) => {
            if (result.value) {
              updatePassword({ oldPassword, newPassword });
            }
          });
        }
      };
      showAlert(10);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    if (error) {
      if ('data' in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  //update profile
  const [updateProfile, { isSuccess: successUpdate }] = useUpdateProfileMutation();
  useEffect(() => {
    if (successUpdate) {
      toast.success('Student add successfully');
    }
  }, [successUpdate]);
  const { user } = useAuth();
  useEffect(() => {
    setData(user);
  }, [user, successUpdate]);
  const [data, setData] = useState({
    name: '',
    image: null as File | null, // Inisialisasi image dengan null
  });
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData({ ...data, image: e.target.files[0] });
    }
  };

  const editItem = async (e: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }
    await updateProfile(formData);
  };

  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (user?.profile_pic != null) {
      const fullImageUrl = `${process.env.NEXT_PUBLIC_URL}${user?.profile_pic}`;
      setProfileImage(fullImageUrl);
    } else {
      const fullImageUrl = '/assets/images/profile-default.jpg';
      setProfileImage(fullImageUrl);
    }
  }, [user]);

  return (
    <div className="mb-5 grid grid-cols-[1fr,3fr] gap-5">
      <div className="panel">
        <div className="mb-5 flex w-full items-center">
          <h5 className="mx-auto text-lg font-semibold dark:text-white-light">My Profile</h5>
        </div>
        <br />
        <div className="mb-5">
          <div className="flex flex-col items-center justify-center">
            <img src={profileImage} alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
            <p className="text-xl font-semibold text-primary">{user?.name}</p>
          </div>
          <br />
          <ul className="m-auto mt-5 flex max-w-[160px] flex-col items-center space-y-4 font-semibold text-white-dark">
            {/* <li className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path
                  d="M2.3153 12.6978C2.26536 12.2706 2.2404 12.057 2.2509 11.8809C2.30599 10.9577 2.98677 10.1928 3.89725 10.0309C4.07094 10 4.286 10 4.71612 10H15.2838C15.7139 10 15.929 10 16.1027 10.0309C17.0132 10.1928 17.694 10.9577 17.749 11.8809C17.7595 12.057 17.7346 12.2706 17.6846 12.6978L17.284 16.1258C17.1031 17.6729 16.2764 19.0714 15.0081 19.9757C14.0736 20.6419 12.9546 21 11.8069 21H8.19303C7.04537 21 5.9263 20.6419 4.99182 19.9757C3.72352 19.0714 2.89681 17.6729 2.71598 16.1258L2.3153 12.6978Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path opacity="0.5" d="M17 17H19C20.6569 17 22 15.6569 22 14C22 12.3431 20.6569 11 19 11H17.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  opacity="0.5"
                  d="M10.0002 2C9.44787 2.55228 9.44787 3.44772 10.0002 4C10.5524 4.55228 10.5524 5.44772 10.0002 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.99994 7.5L5.11605 7.38388C5.62322 6.87671 5.68028 6.0738 5.24994 5.5C4.81959 4.9262 4.87665 4.12329 5.38382 3.61612L5.49994 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.4999 7.5L14.6161 7.38388C15.1232 6.87671 15.1803 6.0738 14.7499 5.5C14.3196 4.9262 14.3767 4.12329 14.8838 3.61612L14.9999 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{' '}
              Web Developer
            </li>
            <li className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path
                  d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Jan 20, 1989
            </li> */}
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  opacity="0.5"
                  d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914C3 11.4234 3 10.8996 3 10.4167Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <circle cx="12" cy="9" r="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M16 15C16 16.1046 16 17 12 17C8 17 8 16.1046 8 15C8 13.8954 9.79086 13 12 13C14.2091 13 16 13.8954 16 15Z" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </li>
            <li className="rounded bg-success-light px-1 text-xs text-success ">{user?.user_type == 1 && <span>Admin</span>}</li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  opacity="0.5"
                  d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li>
              <span>{user?.email}</span>
            </li>
            {/* <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="whitespace-nowrap" dir="ltr">
                +1 (530) 555-12121
              </span>
            </li> */}
          </ul>
          {/* <ul className="mt-7 flex items-center justify-center gap-2">
            <li>
              <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </button>
            </li>
            <li>
              <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path
                    d="M3.33946 16.9997C6.10089 21.7826 12.2168 23.4214 16.9997 20.66C18.9493 19.5344 20.3765 17.8514 21.1962 15.9286C22.3875 13.1341 22.2958 9.83304 20.66 6.99972C19.0242 4.1664 16.2112 2.43642 13.1955 2.07088C11.1204 1.81935 8.94932 2.21386 6.99972 3.33946C2.21679 6.10089 0.578039 12.2168 3.33946 16.9997Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    opacity="0.5"
                    d="M16.9497 20.5732C16.9497 20.5732 16.0107 13.9821 14.0004 10.5001C11.99 7.01803 7.05018 3.42681 7.05018 3.42681M7.57711 20.8175C9.05874 16.3477 16.4525 11.3931 21.8635 12.5801M16.4139 3.20898C14.926 7.63004 7.67424 12.5123 2.28857 11.4516"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </button>
            </li>
          </ul> */}
        </div>
      </div>
      <div>
        <div className="panel">
          <div className="mb-5 flex items-center">
            <h5 className="mr-auto text-lg font-semibold dark:text-white-light">Edit Profile</h5>
          </div>
          <form encType="multipart/form-data" className="space-y-5" onSubmit={editItem}>
            <div>
              <label htmlFor="groupFname" className="text-white-dark">
                Name
              </label>
              {/* <input id="groupFname" type="text" placeholder="Enter First Name" className="form-input" /> */}
              <input type="text" id="name" className="form-input" value={data?.name} onChange={handleNameChange} />
            </div>
            <div>
              <label htmlFor="ctnFile" className="text-white-dark">
                Profile Picture
              </label>
              <input
                className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                type="file"
                id="image"
                onChange={handleImageChange}
              />

              {/* <input
                id="ctnFile"
                type="file"
                className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                required
              /> */}
            </div>
            <div className="flex justify-between">
              <button type="submit" className="btn btn-primary !mt-6">
                Submit
              </button>
              <button onClick={handleDelete} className="btn btn-outline-danger !mt-6">
                Delete Picture
              </button>
            </div>
          </form>
        </div>
        <div className="panel mt-6 ">
          <form className="space-y-5" onSubmit={changePassword}>
            <div className="mb-5 flex items-center">
              <h5 className="mr-auto text-lg font-semibold dark:text-white-light">Change Password</h5>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="inputDefault" className="text-white-dark">
                  Old Password
                </label>
                <input type="password" className="form-input" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="inputDefault" className="text-white-dark">
                  New Password
                </label>
                <input type="password" className="form-input" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="inputDefault" className="text-white-dark">
                  Confirm Password
                </label>
                <input type="password" className="form-input" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary !mt-6">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
