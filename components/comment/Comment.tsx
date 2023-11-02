import PropTypes from 'prop-types';
import React, { FC, useEffect, useRef, useState } from 'react';

import { Box, List } from '@mui/material';
import { Avatar, Divider, ListItem, Typography, ListItemText, ListItemAvatar } from '@mui/material';

type Props = {
  uid: string;
};

// const Comment = (props: Props) => {
const Comment: FC<Props> = ({ uid }) => {
  //--main variable for data
  const [items, setItems] = useState({
    message: '',
    ass_uid: uid,
    parent_id: 0,
  });

  //ACTIVE COMMENT
  //--active for start commnet
  const [active, setActive] = useState(false);

  //--handle active
  const handleActive = () => {
    if (active) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  ///ACTIVE COMMENT

  //SEND COMMNET
  const [createCommentAss, { isSuccess, error }] = useCreateCommentAssignmentMutation();

  //--handle create comment
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (items.message.length === 0) {
      toast.error('Commnet canot be empty');
    } else {
      await createCommentAss(items);
      setItems({
        message: '',
        ass_uid: uid,
        parent_id: 0,
      });
    }
    refetch();
  };
  ///SEND COMMNET

  //GET COMMNET
  const { isLoading, data, refetch } = useGetAllCommentAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data?.filter((item: any) => item.ass_uid === uid);

  console.log(showData);

  useEffect(() => {
    refetch();
  }, [isSuccess]);

  //--data always bottom on scroll component
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (active) {
      // Setelah komponen selesai dimuat, gulirkan elemen ke bawah.
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [showData, active]); // Pastikan untuk menyertakan data atau kondisi lain yang memicu perubahan

  //--call refecth every 5 secods if active
  useEffect(() => {
    if (active) {
      const intervalId = setInterval(() => {
        refetch();
        console.log('makan');
      }, 5000); // 5000 milidetik = 5 detik

      // Membersihkan interval saat komponen tidak lagi diperlukan
      return () => clearInterval(intervalId);
    }
  }, [active]);
  //GET COMMNET

  return (
    <div className="">
      {active ? (
        <>
          <div className=" rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }} ref={scrollRef}>
              <div className="mr-4">
                {showData?.length === 0 ? (
                  <div className="flex items-center justify-center">
                    <br />
                    <br />
                    <br />
                    <span className="mb-5 mt-[-50] text-[14px] text-white-dark">There are not subject</span>
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                ) : (
                  <List disablePadding>
                    {showData?.map((comment: any) => {
                      const parentCom = comment.parent_id == 0;

                      return (
                        <React.Fragment key={comment.id}>
                          {comment.parent_id === 0 ? (
                            <Box sx={{}}>
                              <BlogPostCommentItem
                                uid={uid}
                                userId={comment.user_id}
                                parentId={comment.id}
                                parentCom={parentCom}
                                createdAt={comment.created_at}
                                profilePic={comment.profile_pic}
                                name={comment.name}
                                message={comment.message}
                                refetch={refetch}
                              />
                            </Box>
                          ) : null}
                          {showData.map((reply: any) => {
                            if (reply.parent_id === comment.id) {
                              return (
                                <BlogPostCommentItem
                                  uid={uid}
                                  userId={reply.user_id}
                                  parentId={reply.id}
                                  key={reply?.id}
                                  message={reply?.message}
                                  name={reply?.name || ''}
                                  createdAt={reply?.created_at}
                                  profilePic={reply?.profile_pic}
                                />
                              );
                            }
                          })}
                        </React.Fragment>
                      );
                    })}
                  </List>
                )}
              </div>
            </div>
            <div className="mt-[-5px] bg-opacity-100" style={{ zIndex: 10 }}>
              <hr />
              <div className="panel m-0 rounded-none border-0 p-0 shadow-none">
                <textarea
                  id="ctnTextarea"
                  rows={3}
                  className="form-textarea mb-4 mt-6 bg-white bg-opacity-100"
                  placeholder="Enter Address"
                  required
                  value={items.message}
                  onChange={(e: any) => setItems({ ...items, message: e.target.value })}
                ></textarea>
                <div className="flex justify-between">
                  <button className="btn btn-outline-danger" onClick={handleActive}>
                    End Section
                  </button>
                  <button className="btn btn-primary" onClick={handleSend}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <button className="btn btn-primary" onClick={handleActive}>
            Start Commentar
          </button>
        </div>
      )}
    </div>
  );
};
export default Comment;

import { useAuth } from '@/pages/hooks/auth';

BlogPostCommentItem.propTypes = {
  uid: PropTypes.string,
  name: PropTypes.string,
  profilePic: PropTypes.string,
  message: PropTypes.string,
  cratedAt: PropTypes.string,
  parentCom: PropTypes.bool,
  parentId: PropTypes.number,
  userId: PropTypes.number,
  refetch: () => Promise<void>,
};

export function BlogPostCommentItem({ uid, userId, refetch, parentId, parentCom, name, message, profilePic, createdAt }) {
  //--main variable for data
  const [itemsC, setItemsC] = useState({
    message: '',
    ass_uid: uid,
    parent_id: parentId,
  });

  useEffect(() => {
    setItemsC((prevItemsC) => ({
      ...prevItemsC,
      parent_id: parentId,
    }));
  }, [parentId]);

  //CREATE COMMENT
  const [createCommentAss, { isSuccess, error }] = useCreateCommentAssignmentMutation();
  //--handle send
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (itemsC.message.length === 0) {
      toast.error('replay canot be empty');
    } else {
      await createCommentAss(itemsC);

      setItemsC({
        message: '',
        ass_uid: 'CC46et0yg1lwvWaPEFqt',
        parent_id: parentId,
      });
      setOpenReply(false);
    }
    refetch();
  };

  //REPLY
  //--variable open
  const [openReply, setOpenReply] = useState(false);
  //--handle open reply
  const handleOpenReply = () => {
    if (openReply) {
      setOpenReply(false);
      setItemsC({
        message: '',
        ass_uid: 'CC46et0yg1lwvWaPEFqt',
        parent_id: parentId,
      });
    } else {
      setOpenReply(true);
    }
  };
  //REPLY
  //get data user login
  const { user } = useAuth();

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: 'flex-start',
          py: 3,
          ...(!parentCom && {
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(3)})`,
          }),
        }}
      >
        {user.id === userId ? (
          <ListItemAvatar>
            <Avatar
              alt={name}
              src={`${process.env.NEXT_PUBLIC_URL}${profilePic}`}
              sx={{
                width: 48,
                height: 48,
                border: '4px solid blue', // Atur ukuran dan warna border sesuai kebutuhan
                marginTop: '10px',
              }}
            />
          </ListItemAvatar>
        ) : (
          <ListItemAvatar>
            <Avatar alt={name} src={`${process.env.NEXT_PUBLIC_URL}${profilePic}`} sx={{ width: 48, height: 48, marginTop: '10px' }} />
          </ListItemAvatar>
        )}

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'subtitle1' }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.disabled',
                }}
              >
                {fNow(createdAt)}
              </Typography>
              <Typography component="span" variant="body2">
                {message}
              </Typography>
            </>
          }
        />

        {parentCom && (
          <button onClick={handleOpenReply} className="btn btn-outline-info btn-sm">
            Reply
          </button>
        )}
      </ListItem>

      {parentCom && openReply && (
        <div className="mb-4 ml-14">
          <div className="flex items-center justify-center gap-4">
            <input type="text" placeholder="Some Text..." className="form-input" required onChange={(e: any) => setItemsC({ ...itemsC, message: e.target.value })} />
            <button type="button" className="mr-2 text-gray-500 hover:text-info" onClick={handleSend}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.4975 18.4851L20.6281 9.09373C21.8764 5.34874 22.5006 3.47624 21.5122 2.48782C20.5237 1.49939 18.6511 2.12356 14.906 3.37189L5.57477 6.48218C3.49295 7.1761 2.45203 7.52305 2.13608 8.28637C2.06182 8.46577 2.01692 8.65596 2.00311 8.84963C1.94433 9.67365 2.72018 10.4495 4.27188 12.0011L4.55451 12.2837C4.80921 12.5384 4.93655 12.6658 5.03282 12.8075C5.22269 13.0871 5.33046 13.4143 5.34393 13.7519C5.35076 13.9232 5.32403 14.1013 5.27057 14.4574C5.07488 15.7612 4.97703 16.4131 5.0923 16.9147C5.32205 17.9146 6.09599 18.6995 7.09257 18.9433C7.59255 19.0656 8.24576 18.977 9.5522 18.7997L9.62363 18.79C9.99191 18.74 10.1761 18.715 10.3529 18.7257C10.6738 18.745 10.9838 18.8496 11.251 19.0285C11.3981 19.1271 11.5295 19.2585 11.7923 19.5213L12.0436 19.7725C13.5539 21.2828 14.309 22.0379 15.1101 21.9985C15.3309 21.9877 15.5479 21.9365 15.7503 21.8474C16.4844 21.5244 16.8221 20.5113 17.4975 18.4851Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path opacity="0.5" d="M6 18L21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Divider
        sx={{
          ml: 'auto',
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}

import { formatDistanceToNow } from 'date-fns';
import { useCreateCommentAssignmentMutation, useGetAllCommentAssignmentQuery } from '@/redux/features/comment/commnetApi';
import toast from 'react-hot-toast';

export function fNow(date: Date | number | string) {
  const currentDate = new Date();
  const inputDate = new Date(date);

  const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const differenceInWords = formatDistanceToNow(inputDate);

  return `${differenceInWords} ago`;
}
