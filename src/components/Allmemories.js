import React from 'react';

export const Allmemories = (props) => {
  return <div className="row">
    {props.mems.map((mem) => (
      <div class="card text-white bg-dark  col-5 mt-3" key={mem.index}>
  <div class="card-header">{mem.name}</div>
  <div class="card-body">
    <p class="card-text">{mem.description}</p>
    <small class="tm">{mem.likes} Likes, {mem.dislikes} Dislikes and {mem.tips} Tips</small>
    <button type="button" onClick={ ()=> props.Like(mem.index)} class="btn btn-primary btn-sm">Like</button>
<button type="button" class="btn btn-danger btn-sm" onClick={ ()=> props.disLike(mem.index)}>Dislike</button>
<button type="button" onClick={ ()=> props.Tip(mem.index)} class="btn btn-success btn-sm">Tip</button>
<button type="button" onClick={ ()=> props.deleteMemory(mem.index)}class="btn btn-danger btn-sm">Remove</button>
  </div>
</div>
))};
</div>
};
