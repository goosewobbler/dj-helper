import glamorous from 'glamorous';
import * as React from 'react';

import ITheme from '../../types/ITheme';

interface ITabsProps {
  children?: any;
  headings: any[];
  theme: ITheme;
  buttons?: {
    render: any;
    props: any;
  };
}

interface ITabsState {
  selectedIndex: number;
}

const ContainingDiv = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const TabHeadingsList = glamorous.ul({
  display: 'flex',
  padding: '9px 0 16px 0',
});

const TabHeading = glamorous.button(
  {
    background: 'none',
    border: 'none',
    borderRadius: 0,
    fontSize: '18px',
    margin: '0 8px',
    outline: 'none',
    padding: '4px',
  },
  (props: { theme: ITheme; selected: boolean }) => ({
    borderBottom: `${props.selected ? '4px' : '2px'} solid ${
      props.selected ? props.theme.selectedItemBorderColour : props.theme.primaryTextColour
    }`,
    color: props.theme.primaryTextColour,
    fontFamily: props.theme.font,
  }),
);

const TabPanelContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  height: '100%',
  position: 'relative',
  width: '100%',
});

const ContainerHeader = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

class Tabs extends React.Component<ITabsProps, ITabsState> {
  constructor(props: ITabsProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  public render() {
    const panels = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

    return (
      <ContainingDiv>
        <ContainerHeader>
          <TabHeadingsList>{this.renderHeadings()}</TabHeadingsList>
          {this.props.buttons.render(this.props.buttons.props)}
        </ContainerHeader>
        <TabPanelContainer>{panels[this.state.selectedIndex]}</TabPanelContainer>
      </ContainingDiv>
    );
  }

  private renderHeadings() {
    return this.props.headings.map((heading, index) => {
      const selected = this.state.selectedIndex === index;
      const onClick = () => {
        this.setState({
          selectedIndex: index,
        });
      };
      return (
        <TabHeading theme={this.props.theme} selected={selected} key={heading} onClick={onClick}>
          {heading}
        </TabHeading>
      );
    });
  }
}

export default Tabs;
