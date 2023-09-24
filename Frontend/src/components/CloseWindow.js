import { HiX } from "react-icons/hi";
import { styled } from "styled-components";

const StyledCloseWindow = styled(HiX)`
  color: red;
  font-size : 15px
`;
const BckgrCloseWindow = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  height : 35px;
  width : 35px;
  display : flex;
  justify-content : center;
  align-items : center;
`;

function CloseWindow() {
  return (
    <BckgrCloseWindow>
      <StyledCloseWindow />
    </BckgrCloseWindow>
  );
}

export default CloseWindow;
