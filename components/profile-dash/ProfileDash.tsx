import React, { FC, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '@/pages/hooks/auth';
import { useGetAllClassQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useDeletePicMutation, useUpdatePasswordMutation, useUpdateProfileMutation } from '@/redux/features/user/userApi';
import { useRouter } from 'next/router';

type Props = { showData?: any };

const ProfileDash: FC<Props> = ({ showData }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
  const [deletePic, { isSuccess: successDelete }] = useDeletePicMutation();

  const router = useRouter();

  /**
   * var user for show and var data for update
   */

  //SHOW PROFILE
  const { user } = useAuth();

  const { data: dataClass } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });
  const itemClass = dataClass && dataClass.find((i: any) => i.id === user.class_id);

  //--show profile image
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
  ///SHOW PROFILE

  //EDIT UPDATE PROFILE
  //--endpoin redux
  const [updateProfile, { isSuccess: successUpdate }] = useUpdateProfileMutation();
  //--set data (value) from user
  useEffect(() => {
    setData(user);
  }, [user, successUpdate]);

  const [data, setData] = useState({
    name: '',
    image: null as File | null, // Inisialisasi image dengan null
  });
  //----handle change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: e.target.value });
  };
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   if (e.target.files) {
  //     setData({ ...data, image: e.target.files[0] });
  //   }
  // };
  // const handleImageChange = (event) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

      if (allowedFileTypes.includes(selectedFile.type)) {
        setData({ ...data, image: selectedFile });
        // File memiliki tipe yang diizinkan, Anda dapat melanjutkan pengunggahan atau pemrosesan
        // Misalnya, Anda dapat menyimpan file terpilih ke dalam state atau melakukan tindakan lain.
      } else {
        // File memiliki tipe yang tidak diizinkan, tampilkan pesan kesalahan kepada pengguna
        toast.error('The selected file type is not allowed. Please select an image file (JPEG, PNG, JPG, or GIF).');
        // Atau, Anda dapat menghapus file yang dipilih dari input
        e.target.value = null;
      }
    }
  };
  //--handle update
  const editItem = async (e: any) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }
    await updateProfile(formData);
  };
  //--toast useEffet update
  useEffect(() => {
    if (successUpdate) {
      toast.success('Student add successfully');
    }
  }, [successUpdate]);
  ///EDIT UPDATE PROFILE

  //DELETE IMAGE PROFILE
  //--handle delete image profile
  const handleDelete = async (e: any) => {
    e.preventDefault();
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
  //DELETE IMAGE PROFILE

  //CHANGE PASSWORD
  //--handle change password
  const changePassword = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Password do not match');
    } else {
      const showAlert = async (type: number) => {
        if (type === 10) {
          Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Change',
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
  //----validation password match
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
  ///CHANGE PASSWORD

  return (
    <>
      <div className="">
        <div className="mb-5 flex w-full items-center">
          <h5 className="mx-auto text-lg font-semibold dark:text-white-light">My Profile</h5>
        </div>
        <div className="mb-5">
          <div className="flex flex-col items-center justify-center">
            <img src={profileImage} alt="img" className="mb-5 h-24 w-24 rounded-full !border-2 !border-white object-cover" />
            <p className="text-center text-xl font-semibold text-white">{user?.name}</p>
          </div>
          <ul className="m-auto mt-5 flex max-w-[160px] flex-col items-center space-y-4 font-semibold text-white">
            <li className="!mb-[-8px] flex items-center">
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
            <li className=" rounded bg-success-light px-1 text-sm text-success">
              {user?.user_type == 1 && <span>Admin</span>}
              {user?.user_type == 2 && <span>Teacher</span>}
              {user?.user_type == 3 && <span>Student</span>}
            </li>
            {user?.user_type == 2 && (
              <>
                <li className="!mb-[-8px] !mt-6 flex items-center">
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
                    <div className="flex flex-wrap justify-center">
                      {showData?.subject?.map((subject: any) => (
                        <span key={subject.id} className="badge m-1 whitespace-nowrap bg-info">
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
                <li className="!mb-[-8px] !mt-6 flex items-center">
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
                    <div className="flex flex-wrap justify-center">
                      {showData?.classes?.map((classes: any) => (
                        <span key={classes.id} className="badge badge-outline-info m-1 whitespace-nowrap">
                          {classes.name}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              </>
            )}
            {user?.user_type == 3 && (
              <>
                <li className="!mb-[-8px] !mt-6 flex items-center">
                  <svg className="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9 6.25C7.48122 6.25 6.25 7.48122 6.25 9C6.25 10.5188 7.48122 11.75 9 11.75C10.5188 11.75 11.75 10.5188 11.75 9C11.75 7.48122 10.5188 6.25 9 6.25ZM7.75 9C7.75 8.30965 8.30965 7.75 9 7.75C9.69036 7.75 10.25 8.30965 10.25 9C10.25 9.69036 9.69036 10.25 9 10.25C8.30965 10.25 7.75 9.69036 7.75 9Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9 12.25C7.80424 12.25 6.68461 12.4907 5.83616 12.915C5.03258 13.3168 4.25 14.0106 4.25 15L4.24987 15.0625C4.24834 15.5728 4.24576 16.4322 5.06023 17.0218C5.43818 17.2953 5.9369 17.4698 6.55469 17.581C7.1782 17.6932 7.97721 17.75 9 17.75C10.0228 17.75 10.8218 17.6932 11.4453 17.581C12.0631 17.4698 12.5618 17.2953 12.9398 17.0218C13.7542 16.4322 13.7517 15.5728 13.7501 15.0625L13.75 15C13.75 14.0106 12.9674 13.3168 12.1638 12.915C11.3154 12.4907 10.1958 12.25 9 12.25ZM5.75 15C5.75 14.8848 5.86285 14.5787 6.50698 14.2566C7.10625 13.957 7.98662 13.75 9 13.75C10.0134 13.75 10.8937 13.957 11.493 14.2566C12.1371 14.5787 12.25 14.8848 12.25 15C12.25 15.6045 12.2115 15.6972 12.0602 15.8067C11.9382 15.895 11.6869 16.0134 11.1797 16.1047C10.6782 16.1949 9.97721 16.25 9 16.25C8.02279 16.25 7.3218 16.1949 6.82031 16.1047C6.31311 16.0134 6.06182 15.895 5.93977 15.8067C5.78849 15.6972 5.75 15.6045 5.75 15Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M19 12.75C19.4142 12.75 19.75 12.4142 19.75 12C19.75 11.5858 19.4142 11.25 19 11.25H15C14.5858 11.25 14.25 11.5858 14.25 12C14.25 12.4142 14.5858 12.75 15 12.75H19Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M19.75 9C19.75 9.41422 19.4142 9.75 19 9.75H14C13.5858 9.75 13.25 9.41422 13.25 9C13.25 8.58579 13.5858 8.25 14 8.25H19C19.4142 8.25 19.75 8.58579 19.75 9Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M19 15.75C19.4142 15.75 19.75 15.4142 19.75 15C19.75 14.5858 19.4142 14.25 19 14.25H16C15.5858 14.25 15.25 14.5858 15.25 15C15.25 15.4142 15.5858 15.75 16 15.75H19Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      opacity="0.5"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65018 22.75 10.1058 22.75 11.9435V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6104 20.1071 19.6614 20.4392 18.489 20.5969C17.3498 20.75 15.8942 20.75 14.0565 20.75H9.94359C8.10585 20.75 6.65018 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10583 3.24998 9.94358 3.25ZM5.71085 4.88976C4.70476 5.02503 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02503 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02503 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H14C15.9068 19.25 17.2615 19.2484 18.2892 19.1102C19.2952 18.975 19.8749 18.7213 20.2981 18.2981C20.7213 17.8749 20.975 17.2952 21.1102 16.2892C21.2484 15.2615 21.25 13.9068 21.25 12C21.25 10.0932 21.2484 8.73851 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02503 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976Z"
                      fill="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </li>
                <li>{user?.nis}</li>
                <li className="!mb-[-8px] !mt-6 flex items-center">
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
                <li>{itemClass?.name}</li>
              </>
            )}
            <li className="!mb-[-8px] !mt-6 flex items-center">
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
    </>
  );
};

export default ProfileDash;
