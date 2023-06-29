import { createSlice } from "@reduxjs/toolkit";
var name="";
var id="";
var photo="";
var email="";
try
{
    var x=JSON.parse(window.localStorage.getItem('name'));
    var y=JSON.parse(window.localStorage.getItem('id'));
    var z= JSON.parse(window.localStorage.getItem('photo'));
    var em = JSON.parse(window.localStorage.getItem('email'));
    if(x)
    {
      name=x;
    }
    if(y)
    {
      id=y;
    }
    if(z)
    {
      photo=z;
    }
    if(em)
    {
      email=em;
    }
}catch(e){
    console.log(e);
}
const initialState = {
  name: name,
  id: id,
  photo: photo,
  email:email,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoginDetails: (state, action) => {
      localStorage.setItem('id',JSON.stringify(action.payload.id));
      localStorage.setItem('name',JSON.stringify(action.payload.name));
      localStorage.setItem('photo',JSON.stringify(action.payload.photo));
      localStorage.setItem('email',JSON.stringify(action.payload.email));
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.photo = action.payload.photo;
      state.email= action.payload.email;
    },

    setSignOutState: (state) => {
      localStorage.setItem('id',"");
      localStorage.setItem('name',"");
      localStorage.setItem('photo',"");
      localStorage.setItem('email',"");
      state.name = null;
      state.id = null;
      state.photo = null;
    },

    setMessages: (state, action) => {
    //   console.log(state.name, state.email, state.photo, state.text);
    //   state.text=action.payload.text;
    //   console.log(state.name, state.email, state.photo, state.text);
      
    },
  },
});

export const { setUserLoginDetails, setSignOutState, setMessages } = userSlice.actions;

export const selectUserName = (state) => state.user.name;
export const selectUserId = (state) => state.user.id;
export const selectUserPhoto = (state) => state.user.photo;
export const selectText = (state) => state.user.text;
export const selectEmail = (state)=> state.user.email;

export default userSlice.reducer;