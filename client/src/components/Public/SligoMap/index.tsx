import React from 'react';
import { connect } from 'react-redux';

const SligoMap = (props: any) => {

    return (
        <div>
            <img 
                alt="Leafy Frame"
                src="/assets/media/sligo-map/Frame-Full.png"
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover'
                }}
            />

        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        // items: state.items
    }
}

export default connect(mapStateToProps)(SligoMap);