import styled from "styled-components";

export const Form = styled.form`
  display: "flex";
  flex-direction: "column";
  gap: 32px;
`;

export const Label = styled.label``;

export const Input = styled.input`
  width: 304px;
  height: 40px;
  color: #333;
  border: 1px solid #dcdce6;
  border-radius: 8px;
  padding: 0px 12px;
  font-size: 16px;
`;
interface ButtonProps {
  locked: boolean;
}

export const Button = styled.button<ButtonProps>`
  width: 144px;
  height: 40px;
  background: #6614d2;
  border: 0;
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  line-height: 40px;
  transition: filter 0.2s;

  &:hover {
    opacity: 0.9;
    cursor: ${(props) => (props.locked ? "not-allowed" : "pointer")};
  }
`;

export const Avatar = styled.div`
  border-radius: 16rem;
  overflow: hidden;
  margin-bottom: -1.5rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;

  gap: 12px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  gap: 12px;
`;
