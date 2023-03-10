import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import axios from '../axios'
import Row from './Row'
import YouTube from 'react-youtube'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { IconButton } from '@material-ui/core'
import Loading from './Loading'
import db from '../firebasecon'
import { selectUseremail } from '../feature/user/userSlice'
import { useSelector } from 'react-redux'
import firebase from 'firebase'
import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled'
import MovieIcon from '@material-ui/icons/Movie'
const baseUrl = 'https://image.tmdb.org/t/p/original/'

function Moviebanner () {
  const [i, seti] = useState(0)
  const { id } = useParams()
  const { category } = useParams()
  const request = {
    getdetails: `/movie/${id}?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US`,
    fetchsimilar: `/movie/${id}/similar?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&page=1`,
    getshowdetails: `/tv/${id}?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US`,
    getsimilarmovie: `/movie/${id}/similar?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&page=1`,
    getsimilartv: `/tv/${id}/similar?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US&page=1`,
    getrecommendedmovie: `/movie/${id}/recommendations?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&page=1`,
    getrecommendedtv: `/tv/${id}/recommendations?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&page=1`,
    gettrailertv: `/tv/${id}/videos?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8`,
    gettrailermovie: `/movie/${id}/videos?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8`

  }
  const [detail, setdetail] = useState({})
  const [similar, setsimilar] = useState()
  const [recommend, setrecommend] = useState()
  const [trailer, settrailer] = useState()
  const [trailerurl, settrailerurl] = useState()
  const useremail = useSelector(selectUseremail)
  if (category === 'movie') {
    useEffect(() => {
      async function fetchData () {
        setdetail({})
        setsimilar('')
        setrecommend('')
        const req = await axios.get(request.getdetails)
        setdetail(req.data)
        console.log(req.data)
        setsimilar(request.getsimilarmovie)
        setrecommend(request.getrecommendedmovie)
        return req
      }
      async function fetchtrailer () {
        const req = await axios.get(request.gettrailermovie)
        settrailer(req.data.results)
        console.log(req.data.results)
        return req
      }
      fetchData()
      fetchtrailer()
    }, [request.getdetails])
  } else {
    useEffect(() => {
      async function fetchData () {
        setdetail({})
        setsimilar('')
        setrecommend('')
        const req = await axios.get(request.getshowdetails)
        setdetail(req.data)
        setsimilar(request.getsimilartv)
        setrecommend(request.getrecommendedtv)
        return req
      }
      async function fetchtrailer () {
        const req = await axios.get(request.gettrailertv)
        settrailer(req.data.results)
        return req
      }
      fetchData()
      fetchtrailer()
    }, [request.getdetails])
  }

  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  }

  function play () {
    if (trailer.length > 0) {
      settrailerurl(trailer[i].key)
      document.getElementById('p').style.display = 'block'
      document.getElementById('p').style.width = '90vw'
      document.getElementById('p').style.height = '100vh'
      document.getElementById('container').style.opacity = '0'
    } else {
      document.getElementById('notrailer').style.visibility = 'visible'
      document.getElementById('notrailer').style.opacity = '1'
    }
  }

  function hide () {
    settrailerurl('')
    document.getElementById('p').style.display = 'none'
    document.getElementById('p').style.width = '0vw'
    document.getElementById('p').style.height = '0vh'
    document.getElementById('container').style.opacity = '1'
    return 'a'
  }

  function adddatatrailer () {
    if (category === 'movie' && i === 0) {
      db.collection('user').doc(useremail).collection(category).doc(id).set({
        movieid: id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
    if (category === 'show' && i === 0) {
      db.collection('user').doc(useremail).collection(category).doc(id).set({
        tvid: id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }

  async function nextrailer () {
    // eslint-disable-next-line prefer-const
    let p = i + 1
    if (p < trailer.length) { seti(p) } else { seti(0) }
    await hide()
    play()
  }
  if (detail && similar && recommend) {
    return (
        <>
        <Container>
             <center>
                <Notrailer id = "notrailer">
                    <h2>Sorry! Trailer UnAvaialble</h2>
                </Notrailer>
              </center>
            <Background id="container">
                <img alt={detail.title} src={`${baseUrl}${detail?.backdrop_path || detail?.poster_path}`}/>
            </Background>
            <ContentMeta>
                <Title>{detail?.original_title || detail?.name || detail?.title }</Title>
                <Controls>
                    <Player>
                        <IconButton>
                          <PlayCircleIcon/>
                        </IconButton>
                        <span>Play</span>
                    </Player>
                    <a href="#p" onClick = {function (event) { play(); adddatatrailer() }}>
                        <Trailer>
                           <IconButton>
                              <MovieIcon/>
                           </IconButton>
                            <span>Trailer</span>
                        </Trailer>
                    </a>
                    <AddList onClick = {() => nextrailer()}>
                      {i}
                    </AddList>
                </Controls>
                <Dessc>{detail.overview}</Dessc>
            </ContentMeta>
            <div id = "p" style={{ marginTop: '20px', display: 'none' }}>
                <IconButton style={{ float: 'right' }} onClick = {() => hide()}>
                    <HighlightOffIcon style={{ fontSize: '50px', color: '#d9534f' }}/>
                </IconButton>
                <TrailerVideo>
                        {trailerurl && <YouTube videoId={trailerurl} opts={opts}/>}
                </TrailerVideo>
            </div>
            <Row title = {'Recommended For you'} fetchurl = {recommend} />
            <Row title = {'Similar Movies'} fetchurl = {similar}/>
        </Container>
        </>
    )
  } else {
    return (
            <Loading />
    )
  }
}

const Container = styled.main`
    position: relative;
    min-height : calc(100vh - 250px);
    overflow: hidden;
    display: block;
    top: 72px;
    padding: 0 calc(3.5vw + 5px);
`
const Background = styled.div`
    left: 0px;
    opacity: 0.8;
    position: fixed;
    right: 0px;
    top: 0px;
    z-index: -1;

    img {
        width: 100vw;
        height: 100vh;
        object-fit: cover;

        @media (max-width: 768px){
            width: initial;
        }
    }
`
const ContentMeta = styled.div`
  max-width: 874px;
`
const Title = styled.div`
    line-height: 1.4;
    font-size: 40px;
    fot-weight : 800;
    padding: 16px 0px;
    color: rgb(249, 249, 249);
`
const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  background: rgb (249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);
  img {
    width: 32px;
  }
  &:hover {
    background: rgb(198, 198, 198);
  }
  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;
    img {
      width: 25px;
    }
  }
`

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;
    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }
    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`

const TrailerVideo = styled.div`
    justify-content: center;
    align-items: center;
`
const Dessc = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);
  @media (max-width: 768px) {
    font-size: 14px;
  }
`
const Notrailer = styled.div`
    background-color: #f0ad4e;
    border-radius: 5px;
    width: 40%;
    height: 20% auto;
    text-align : center;
    padding: 3px;
    margin: 6px;
    visibility: visible;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s ease-in;

    @media (max-width: 1000px) {
      width: 100%;
      margin: 3px;
      height: 10% ;
    }
`

export default Moviebanner

/*

<Rating>{detail.vote_average}</Rating>
<Generes>
                {detail.genres
                    ? detail.genres.map(genres => (
                        <h4 key= {genres.id} >{genres.name}</h4>
                    ))
                    : ''}
                </Genres>

*/
