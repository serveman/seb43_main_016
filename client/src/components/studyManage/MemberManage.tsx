import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { LogInState } from "../../recoil/atoms/LogInState";
import { useParams } from "react-router-dom";
import {
  StudyGroupMemberApprovalDto,
  delegateStudyGroupLeader,
  forceExitStudyGroup,
  getStudyGroupMemberList,
} from "../../apis/StudyGroupApi";
import { GiBootKick, GiLaurelCrown } from "react-icons/gi";

// TODO: 스터디 그룹에 가입된 회원 리스트 타입
export interface StudyGroupMemberListDto {
  nickName: string[];
}

interface MemberManageProps {
  studyLeader: string | undefined;
}

const MemberManage = ({ studyLeader }: MemberManageProps) => {
  const isLoggedIn = useRecoilValue(LogInState);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [memberList, setMemberList] = useState<StudyGroupMemberListDto | null>(
    null
  );
  console.log(studyLeader)

  // 스터디 그룹 멤버 리스트를 불러오는 함수
  const fetchMemberList = async () => {
    try {
      const response = await getStudyGroupMemberList(Number(id), isLoggedIn);
      if (response) {
        setMemberList(response);
      } else {
        setMemberList(null);
      }
    } catch (error) {
      alert("멤버 목록을 불러오는데 실패했습니다");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchMemberList();
  }, []);

  // TODO : 스터디 그룹장의 권한을 위임하는 함수
  const handlePrivileges = async (nickname: string) => {
    const data: StudyGroupMemberApprovalDto = {
      nickName: nickname,
    };
    try {
      await delegateStudyGroupLeader(Number(id), data);
      alert("권한 위임에 성공했습니다");
      location.reload();
    } catch (error) {
      alert("스터디장만이 권한을 위임할 수 있습니다");
    }
    fetchMemberList();
  };

  // TODO : 스터디 그룹에서 강제로 퇴출하는 함수
  const handleForcedKicked = async (nickname: string) => {
    const data: StudyGroupMemberApprovalDto = {
      nickName: nickname,
    };
    await forceExitStudyGroup(Number(id), data);
    location.reload();
  };

  return (
    <>
      <div>회원 목록</div>
      <>
        {memberList &&
          memberList.nickName.map((nickname, index) => (
            <div key={index}>
              {nickname}
              <button onClick={() => handlePrivileges(nickname)}>
                <GiLaurelCrown />
              </button>
              <button onClick={() => handleForcedKicked(nickname)}>
                <GiBootKick />
              </button>
            </div>
          ))}
      </>
    </>
  );
};

export default MemberManage;