import { useRouter } from 'next/router';
import { useDeletePicMutation, useUpdatePasswordMutation, useUpdateProfileMutation } from '@/redux/features/user/userApi';
import { useAuth } from '@/pages/hooks/auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';

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
    // console.log('hallo');
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
    // e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    await updateProfile(formData);
  };
  // console.log(data);
  console.log(data?.image);

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
  // only for teacher
  useEffect(() => {
    if (user && user.user_type !== 2) {
      router.push('/404');
    }
  }, [user]);
  /// only for teacher

  //get teacher
  const { isLoading, data: dataTeacher, refetch } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });
  const showData = dataTeacher && dataTeacher.find((i: any) => i.id === user.id);
  const [itemsShow, setItemsShow] = useState({});
  useEffect(() => {
    if (showData) {
      setItemsShow(showData);
    }
  }, [showData]);
  // console.log(showData);
  ///get teacher

  return (
    <>
      {/* only for teacher*/}
      {!user ||
        (user?.user_type !== 2 && (
          <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
            <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
              <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
              </path>
              <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        ))}
      {/* !only for teacher*/}
      <div className="mb-5 grid grid-cols-[1fr,3fr] gap-5">
        <div className="panel">
          <div className="mb-5 flex w-full items-center">
            <h5 className="mx-auto text-lg font-semibold dark:text-white-light">My Profile</h5>
          </div>
          <div className="mb-5">
            <div className="flex flex-col items-center justify-center">
              <img src={profileImage} alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
              <p className="text-center text-xl font-semibold text-primary">{user?.name}</p>
            </div>
            <ul className="m-auto mt-5 flex max-w-[160px] flex-col items-center space-y-4 font-semibold text-white-dark">
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
              <li className="rounded bg-success-light px-1 text-xs text-success">{user?.user_type == 2 && <span>Teacher</span>}</li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    opacity="0.5"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25H11.9426ZM6.25 2.98181C5.18517 3.16506 4.50829 3.4813 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62178 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62178 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12C21.25 9.62178 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4917 3.4813 18.8148 3.16506 17.75 2.98181V11.831C17.75 12.2986 17.75 12.6821 17.7326 12.9839C17.7155 13.2816 17.6786 13.5899 17.5563 13.8652C17.1149 14.859 16.0259 15.3949 14.9691 15.1383C14.6764 15.0673 14.4096 14.9084 14.1633 14.7404C13.9136 14.57 13.6097 14.336 13.2392 14.0508L13.2207 14.0365C12.7513 13.6751 12.6192 13.5804 12.4981 13.5277C12.1804 13.3897 11.8196 13.3897 11.5019 13.5277C11.3808 13.5804 11.2487 13.6751 10.7793 14.0365L10.7608 14.0508C10.3903 14.336 10.0864 14.57 9.83672 14.7404C9.59039 14.9084 9.32356 15.0673 9.03086 15.1383C7.97413 15.3949 6.88513 14.859 6.44371 13.8652C6.32145 13.5899 6.28454 13.2816 6.26739 12.9839C6.24999 12.6821 6.25 12.2986 6.25 11.831V2.98181ZM16.25 2.81997C15.1242 2.75085 13.7418 2.75 12 2.75C10.2582 2.75 8.87584 2.75085 7.75 2.81997V11.8076C7.75 12.3043 7.7503 12.6442 7.7649 12.8976C7.78003 13.1601 7.80769 13.2408 7.81457 13.2563C7.96171 13.5876 8.32471 13.7662 8.67695 13.6807C8.69342 13.6767 8.77428 13.6493 8.99148 13.5012C9.20112 13.3582 9.47062 13.151 9.86419 12.848L9.93118 12.7964C10.3014 12.5109 10.5899 12.2885 10.9042 12.152C11.6032 11.8483 12.3968 11.8483 13.0958 12.152C13.4101 12.2885 13.6986 12.5109 14.0688 12.7964L14.1358 12.848C14.5294 13.151 14.7989 13.3582 15.0085 13.5012C15.2257 13.6493 15.3066 13.6767 15.323 13.6807C15.6753 13.7662 16.0383 13.5876 16.1854 13.2563C16.1923 13.2408 16.22 13.1601 16.2351 12.8976C16.2497 12.6442 16.25 12.3043 16.25 11.8076V2.81997Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.25 18C6.25 17.5858 6.58579 17.25 7 17.25H17C17.4142 17.25 17.75 17.5858 17.75 18C17.75 18.4142 17.4142 18.75 17 18.75H7C6.58579 18.75 6.25 18.4142 6.25 18Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </li>
              <li>
                {showData?.subject?.length === 0 ? (
                  <span className="text-[14px] text-white-dark">There are not subject</span>
                ) : (
                  <>
                    {showData?.subject?.map((subject: any) => (
                      <span key={subject.id} className="badge m-1 whitespace-nowrap bg-info">
                        {subject.name}
                      </span>
                    ))}
                  </>
                )}
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 21" fill="none" className="h-5 w-5">
                  <path
                    opacity="0.5"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.4948 2.33224C11.6423 1.57447 10.3577 1.57447 9.50518 2.33224L3.50518 7.66558C3.02483 8.09255 2.75 8.70457 2.75 9.34725V19.2501H4.25L4.25 13.948C4.24997 13.0496 4.24994 12.3004 4.32991 11.7056C4.41432 11.0778 4.59999 10.511 5.05546 10.0555C5.51093 9.60004 6.07773 9.41437 6.70552 9.32996C7.3003 9.25 8.04952 9.25002 8.94801 9.25005H13.052C13.9505 9.25002 14.6997 9.25 15.2945 9.32996C15.9223 9.41437 16.4891 9.60004 16.9445 10.0555C17.4 10.511 17.5857 11.0778 17.6701 11.7056C17.7501 12.3004 17.75 13.0496 17.75 13.9481V19.2501H19.25V9.34725C19.25 8.70457 18.9752 8.09255 18.4948 7.66558L12.4948 2.33224ZM20.75 19.2501V9.34725C20.75 8.27611 20.2919 7.25609 19.4914 6.54446L13.4914 1.21113C12.0705 -0.0518223 9.92946 -0.0518223 8.50864 1.21113L2.50864 6.54446C1.70805 7.25609 1.25 8.27611 1.25 9.34725V19.2501H1C0.585786 19.2501 0.25 19.5858 0.25 20.0001C0.25 20.4143 0.585786 20.7501 1 20.7501H21C21.4142 20.7501 21.75 20.4143 21.75 20.0001C21.75 19.5858 21.4142 19.2501 21 19.2501H20.75ZM16.25 19.2501V14.0001C16.25 13.036 16.2484 12.3885 16.1835 11.9054C16.1214 11.444 16.0142 11.2465 15.8839 11.1162C15.7536 10.9859 15.5561 10.8786 15.0946 10.8166C14.6116 10.7516 13.964 10.7501 13 10.7501H9C8.03599 10.7501 7.38843 10.7516 6.90539 10.8166C6.44393 10.8786 6.24643 10.9859 6.11612 11.1162C5.9858 11.2465 5.87858 11.444 5.81654 11.9054C5.75159 12.3885 5.75 13.036 5.75 14.0001V19.2501H16.25ZM8.25 7.00005C8.25 6.58584 8.58579 6.25005 9 6.25005H13C13.4142 6.25005 13.75 6.58584 13.75 7.00005C13.75 7.41426 13.4142 7.75005 13 7.75005H9C8.58579 7.75005 8.25 7.41426 8.25 7.00005ZM7.25 13.5001C7.25 13.0858 7.58579 12.7501 8 12.7501H14C14.4142 12.7501 14.75 13.0858 14.75 13.5001C14.75 13.9143 14.4142 14.2501 14 14.2501H8C7.58579 14.2501 7.25 13.9143 7.25 13.5001ZM7.25 16.5001C7.25 16.0858 7.58579 15.7501 8 15.7501H14C14.4142 15.7501 14.75 16.0858 14.75 16.5001C14.75 16.9143 14.4142 17.25 14 17.25H8C7.58579 17.25 7.25 16.9143 7.25 16.5001Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </li>
              <li>
                {showData?.classes?.length === 0 ? (
                  <span className="text-[14px] text-white-dark">There are not classes</span>
                ) : (
                  <>
                    {showData?.classes?.map((classes: any) => (
                      <span key={classes.id} className="badge badge-outline-info m-1 whitespace-nowrap">
                        {classes.name}
                      </span>
                    ))}
                  </>
                )}
              </li>
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
            </ul>
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
    </>
  );
};

export default index;
