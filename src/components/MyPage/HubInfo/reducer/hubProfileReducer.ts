export interface HubProfileState {
    description: string;
    blog: string;
    firstLinkType: string;
    firstLink: string;
    secondLinkType: string;
    secondLink: string;
    answer1: string;
    answer2: string;
    answer3: string;
    techStacks: string[];
  }
  
// 상태를 변경하는 액션들의 타입 정의
export type HubProfileAction =
| { type: "SET_DESCRIPTION"; payload: string }
| { type: "SET_BLOG"; payload: string }
| { type: "SET_FIRST_LINK_TYPE"; payload: string }
| { type: "SET_FIRST_LINK"; payload: string }
| { type: "SET_SECOND_LINK_TYPE"; payload: string }
| { type: "SET_SECOND_LINK"; payload: string }
| { type: "SET_ANSWER1"; payload: string }
| { type: "SET_ANSWER2"; payload: string }
| { type: "SET_ANSWER3"; payload: string }
| { type: "SET_TECH_STACKS"; payload: string[] };

// 액션에 따라 상태를 업데이트하는 리듀서 함수
export const hubProfileReducer = ( state: HubProfileState, action: HubProfileAction): HubProfileState => {
  switch (action.type) {
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_BLOG":
      return { ...state, blog: action.payload };
    case "SET_FIRST_LINK_TYPE":
      return { ...state, firstLinkType: action.payload };
    case "SET_FIRST_LINK":
      return { ...state, firstLink: action.payload };
    case "SET_SECOND_LINK_TYPE":
      return { ...state, secondLinkType: action.payload };
    case "SET_SECOND_LINK":
      return { ...state, secondLink: action.payload };
    case "SET_ANSWER1":
      return { ...state, answer1: action.payload };
    case "SET_ANSWER2":
      return { ...state, answer2: action.payload };
    case "SET_ANSWER3":
      return { ...state, answer3: action.payload };
    case "SET_TECH_STACKS":
      return { ...state, techStacks: action.payload };
    default:
      return state;
  }
};