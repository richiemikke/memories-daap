import React from 'react';
import { useState } from "react";

export const Addmemory = (props) => {

const [name, setName] = useState('');
const [description, setDescription] = useState('');



  return <div>
      <form>
  <div class="form-row">
    
      <input type="text" class="form-control" value={name}
           onChange={(e) => setName(e.target.value)} placeholder="Name"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>

      <button type="button" onClick={()=>props.addMemory(name, description)} class="btn btn-dark mt-2">Add Memory</button>

  </div>
</form>
  </div>;
};
