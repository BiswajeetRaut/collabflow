import { createSlice } from "@reduxjs/toolkit";
import db from "../../firebase";
var id="";
try
{
    var y=JSON.parse(window.localStorage.getItem('projectid'));
    if(y)
    {
      id=y;
    }
}catch(e){
    console.log(e);
}
const initialState = {
  id: id,
  members:[],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      localStorage.setItem('projectid',JSON.stringify(action.payload.id));
      state.id = action.payload.id;
    },
    setSignOutProject:(state)=>{
        localStorage.setItem('projectid','');
        state.id='';
    },
    setMembers: (state, action) => {
    },
  },
});

export const { setProject,setSignOutProject } = projectSlice.actions;

export const selectProjectId = (state) => state.project.id;

export default projectSlice.reducer;