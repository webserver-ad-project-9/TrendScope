import type {
  CommunityCategoryCodeDto,
  CommunityCategoryResponseDto,
  CommunityCommentResponseDto,
  CommunityPostDetailResponseDto,
  CommunityPostLikeResponseDto,
  CommunityPostListItemResponseDto,
  CreateCommunityCommentRequestDto,
  CreateCommunityPostRequestDto,
  CreateCommunityPostResponseDto,
  PageResponseDto,
} from "@/src/types/api";
import type {
  BoardPostViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionId,
  CommunityBoardSectionViewModel,
  CommunityPostDraftViewModel,
  PostCommentViewModel,
} from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

const defaultCommunityPageSize = 20;

const categoryCodeByBoardSectionId: Record<
  CommunityBoardSectionId,
  CommunityCategoryCodeDto
> = {
  politics: "POLITICS",
  economy: "ECONOMY",
  society: "SOCIETY",
  it: "IT_SCIENCE",
  global: "WORLD",
  sports: "SPORTS",
  entertainment: "ENTERTAINMENT",
};

const boardSectionIdByCategoryCode: Record<
  CommunityCategoryCodeDto,
  CommunityBoardSectionId
> = {
  POLITICS: "politics",
  ECONOMY: "economy",
  SOCIETY: "society",
  IT_SCIENCE: "it",
  WORLD: "global",
  SPORTS: "sports",
  ENTERTAINMENT: "entertainment",
};

const categoryLabelByCode: Record<CommunityCategoryCodeDto, string> = {
  POLITICS: "정치",
  ECONOMY: "경제",
  SOCIETY: "사회",
  IT_SCIENCE: "IT/과학",
  WORLD: "세계",
  SPORTS: "스포츠",
  ENTERTAINMENT: "연예",
};

const categoryDescriptionByBoardSectionId: Record<CommunityBoardSectionId, string> = {
  politics: "국회, 정당, 선거 이슈",
  economy: "증시, 기업, 산업 흐름",
  society: "생활, 정책, 사건 이슈",
  it: "AI, 플랫폼, 반도체 기술",
  global: "해외 시장과 국제 이슈",
  sports: "스포츠 이슈와 경기 흐름",
  entertainment: "방송, 콘텐츠, 연예 이슈",
};

/**
 * 백엔드 게시판 카테고리 목록을 UI 섹션 모델로 변환한다.
 */
export async function fetchCommunityBoardSections(): Promise<
  readonly CommunityBoardSectionViewModel[]
> {
  const categoryDtos = await requestBackendApi<readonly CommunityCategoryResponseDto[]>(
    "/api/community/categories",
    { authentication: "none" },
  );

  return categoryDtos.map(mapCommunityCategoryDtoToViewModel);
}

/**
 * 게시글 목록을 백엔드에서 조회한다. 로그인 토큰이 있으면 선택 인증으로 함께 보낸다.
 */
export async function fetchCommunityPosts(
  sectionId: CommunityBoardFilterId,
): Promise<readonly BoardPostViewModel[]> {
  const queryString = createCommunityPostListQueryString(sectionId);
  const page = await requestBackendApi<
    PageResponseDto<CommunityPostListItemResponseDto>
  >(`/api/posts${queryString}`, { authentication: "optional" });

  return page.content.map(mapCommunityPostListItemDtoToViewModel);
}

/**
 * 게시글 상세와 댓글 목록을 함께 조회해 상세 화면용 view model을 만든다.
 */
export async function fetchCommunityPostThread(
  postId: string,
): Promise<BoardPostViewModel> {
  const [postDetailDto, commentDtos] = await Promise.all([
    requestBackendApi<CommunityPostDetailResponseDto>(`/api/posts/${postId}`, {
      authentication: "optional",
    }),
    requestBackendApi<readonly CommunityCommentResponseDto[]>(
      `/api/posts/${postId}/comments`,
      { authentication: "optional" },
    ),
  ]);

  return mapCommunityPostDetailDtoToViewModel(
    postDetailDto,
    commentDtos.map(mapCommunityCommentDtoToViewModel),
  );
}

/**
 * 로그인 사용자의 게시글을 생성하고 생성된 게시글 ID를 반환한다.
 */
export async function createCommunityPost(
  draft: CommunityPostDraftViewModel,
): Promise<string> {
  const requestBody: CreateCommunityPostRequestDto = {
    category: categoryCodeByBoardSectionId[draft.boardSectionId],
    title: draft.title.trim(),
    content: draft.body.trim(),
  };
  const responseDto = await requestBackendApi<CreateCommunityPostResponseDto>("/api/posts", {
    method: "POST",
    body: requestBody,
  });

  return responseDto.id;
}

/**
 * 로그인 사용자의 댓글을 생성한다.
 */
export async function createCommunityComment(
  postId: string,
  content: string,
): Promise<PostCommentViewModel> {
  const requestBody: CreateCommunityCommentRequestDto = {
    content: content.trim(),
  };
  const commentDto = await requestBackendApi<CommunityCommentResponseDto>(
    `/api/posts/${postId}/comments`,
    {
      method: "POST",
      body: requestBody,
    },
  );

  return mapCommunityCommentDtoToViewModel(commentDto);
}

/**
 * 게시글 좋아요를 생성하고 백엔드 최종 count를 반환한다.
 */
export async function likeCommunityPost(
  postId: string,
): Promise<CommunityPostLikeResponseDto> {
  return requestBackendApi<CommunityPostLikeResponseDto>(`/api/posts/${postId}/likes`, {
    method: "POST",
  });
}

/**
 * 게시글 좋아요를 취소하고 백엔드 최종 count를 반환한다.
 */
export async function unlikeCommunityPost(
  postId: string,
): Promise<CommunityPostLikeResponseDto> {
  return requestBackendApi<CommunityPostLikeResponseDto>(`/api/posts/${postId}/likes`, {
    method: "DELETE",
  });
}

function createCommunityPostListQueryString(sectionId: CommunityBoardFilterId): string {
  const params = new URLSearchParams({
    page: "0",
    size: String(defaultCommunityPageSize),
  });

  if (sectionId !== "all") {
    params.set("category", categoryCodeByBoardSectionId[sectionId]);
  }

  return `?${params.toString()}`;
}

function mapCommunityCategoryDtoToViewModel(
  categoryDto: CommunityCategoryResponseDto,
): CommunityBoardSectionViewModel {
  const sectionId = boardSectionIdByCategoryCode[categoryDto.code];

  return {
    id: sectionId,
    label: categoryDto.label || categoryLabelByCode[categoryDto.code],
    description: categoryDescriptionByBoardSectionId[sectionId],
  };
}

function mapCommunityPostListItemDtoToViewModel(
  postDto: CommunityPostListItemResponseDto,
): BoardPostViewModel {
  const boardSectionId = boardSectionIdByCategoryCode[postDto.category];

  return {
    id: postDto.id,
    boardSectionId,
    category: categoryLabelByCode[postDto.category],
    title: postDto.title,
    author: postDto.writerName,
    likeCount: postDto.likeCount,
    commentCount: postDto.commentCount,
    viewCount: postDto.viewCount,
    createdAt: formatCommunityDate(postDto.createdAt),
    isMine: postDto.isMine,
    likedByMe: false,
    body: "",
    comments: [],
  };
}

function mapCommunityPostDetailDtoToViewModel(
  postDto: CommunityPostDetailResponseDto,
  comments: readonly PostCommentViewModel[],
): BoardPostViewModel {
  const boardSectionId = boardSectionIdByCategoryCode[postDto.category];

  return {
    id: postDto.id,
    boardSectionId,
    category: categoryLabelByCode[postDto.category],
    title: postDto.title,
    author: postDto.writer.name,
    likeCount: postDto.likeCount,
    commentCount: postDto.commentCount,
    viewCount: postDto.viewCount,
    createdAt: formatCommunityDate(postDto.createdAt),
    isMine: postDto.isMine,
    likedByMe: postDto.likedByMe,
    body: postDto.content,
    comments,
  };
}

function mapCommunityCommentDtoToViewModel(
  commentDto: CommunityCommentResponseDto,
): PostCommentViewModel {
  return {
    id: commentDto.id,
    author: commentDto.writerName,
    body: commentDto.content,
    createdAt: formatCommunityDate(commentDto.createdAt),
    isMine: commentDto.isMine,
  };
}

function formatCommunityDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
