import React from 'react';



 
class Sandbox extends React.Component {




 


    handleInput = (e, field) => {
        console.log(e)
    }

 

    value = "tom";



    render() {
        return (


           <form>
               <div className="form_element">
                        <select
                            value={this.value || null}
                            onChange={(event) => this.handleInput(event, 'category_ref')}
                        >   
                            <option value="cate" disabled >Category</option>

                            <option value="tom" >Tomato</option>
                            <option value="bazu" >Bazuzu</option>
                            <option value="bazo">Bazoozoo</option>


                            {/* { this.props.cats && this.props.cats.length ?
                                this.props.cats.map ( (cat, i) => (
                                    <option key={i} value={`"${cat.cat_id}"`}>{cat.title}</option>
                                ))
                            : null } */}
                        </select>
                    </div>  
           </form>
        )
    }
};
 
export default Sandbox;
