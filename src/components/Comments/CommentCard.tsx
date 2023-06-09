import { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { IComment } from '@/pages/splits/[splitId]';
import useText from '@/services/site-properties/parsing';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED64A6' /%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%23F56565' /%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%2338B2AC' /%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED8936' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

interface ICommentProps {
  author: string;
  authorRole: string;
  commentId: string;
  commentReplys: IComment[];
  addHandler?: (text: string, parentCommentId?: string) => Promise<void>;
  commentText: string;
  index: number;
  isReply: string;
}

export default function Comment({
  author,
  authorRole,
  commentId,
  commentReplys,
  commentText,
  index,
  addHandler,
  isReply,
}: ICommentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  let replies = commentReplys ?? [];

  const locale = useSelector((state: RootState) => state.language.language);

  const text = {
    show: useText('components.comment.card.show.replies', locale),
    add: useText('components.comment.card.add.replies', locale),
    replies: useText('components.comment.card.replies', locale),
    placeholder: useText(
      'pages.splits.split-id.textarea.placeholder.text',
      locale
    ),
  };
  return (
    <Box>
      <Box
        flexDirection={'column'}
        textAlign={'center'}
        justifyContent={'center'}
      >
        <Typography
          variant="body1"
          fontFamily={'Inter'}
          fontWeight={'medium'}
          fontSize={'15px'}
          pb={4}
        >
          {commentText}
        </Typography>
        <Typography
          variant="body1"
          fontFamily={'Work Sans'}
          fontWeight={'bold'}
          fontSize={14}
        >
          {author}
          <span> - {authorRole}</span>
        </Typography>

        {isReply && (
          <>
            <Button onClick={() => setShowReplies(!showReplies)}>
              {text.show}
            </Button>
            <Stack m="2rem">
              <TextareaAutosize
                placeholder={text.placeholder}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <Box alignItems="center" justifyContent="center">
                <Button
                  onClick={() => {
                    addHandler && addHandler(newReply, commentId);
                    setNewReply('');
                  }}
                >
                  {text.add}
                </Button>
              </Box>
            </Stack>
          </>
        )}

        {showReplies && replies.length != 0 && (
          <Stack direction="column">
            <Box alignItems="center">
              <Typography variant="h6" textAlign="center">
                {text.replies}
              </Typography>
            </Box>
            {replies.map((reply) => {
              return (
                <Comment
                  {...reply}
                  key={reply.commentId}
                  index={index}
                  isReply=""
                />
              );
            })}
          </Stack>
        )}
      </Box>
      {/* {!showReplies  && (
        <Avatar
          height={"80px"}
          width={"80px"}
          alignSelf={"center"}
          m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
        />
      )} */}
    </Box>
  );
}
