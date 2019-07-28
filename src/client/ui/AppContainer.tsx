import * as React from 'react';

interface IAppContainerProps {
  banner: any;
  dialog: any;
  header: any;
  leftPanel: any;
  rightPanel: any;
}

const AppContainer = (props: IAppContainerProps) => (
  <div>
    {props.banner}
    <div className="header">{props.header}</div>
    <div className="content">
      <div className="section">{props.leftPanel}</div>
      <div className="section">{props.rightPanel}</div>
      {props.dialog}
    </div>
  </div>
);

export default AppContainer;
