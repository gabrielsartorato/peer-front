import styled from "styled-components";

export const Content = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const Container = styled.div`
    
`;

export const VideoArea = styled.div`
    display: flex;
    gap: 16px;
    padding: 20px;
    height: 95vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

export const Actions = styled.div`
    width: 100%;
    height: 5vh;
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
    align-items: center;
    margin: 12px 0px;
`;

export const StyledVideo = styled.video`
    height: 40%;
    width: 30%;
    border-radius: 16px;
    border: 1px solid black;
`;

export const Button = styled.button`
    cursor: pointer;

`;

export const IconButton = styled.button`
    width: 50px;
    height: 50px;
    padding: 16px;
    cursor: pointer;
    background-color: #c3c3c3;
    border: 0px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        opacity: 0.7;
    }
    
`;