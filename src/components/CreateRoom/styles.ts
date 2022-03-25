import styled from 'styled-components';

export const Form = styled.form`
    display: 'flex';
    flex-direction: 'column';
    gap: 32px;
`;

export const Label = styled.label`

`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  color: #333;
  border: 1px solid #dcdce6;
  border-radius: 8px;
  padding: 0px 12px;
  margin-top: 4px;
`;

export const Button = styled.button`
    width: 100%;
    height: 40px;
    background: #6614D2;
    margin-top: 16px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    font-size: 18px;
    line-height: 40px;
    transition: filter 0.2s;

    :hover {
        opacity: 0.9;
    }
`;
