import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import React from "react";

function SideNavigation() {
  return (
    <Sidebar>
      <Menu>
        {/* <SubMenu label="Charts">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu> */}

        <SubMenu label="Groups">
          <MenuItem> Group 1</MenuItem>
          <MenuItem> Group 2 </MenuItem>
        </SubMenu>
        <MenuItem> Calendar </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideNavigation;
