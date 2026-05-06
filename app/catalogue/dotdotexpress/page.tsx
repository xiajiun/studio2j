'use client'

export const runtime = 'edge'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const BRANDS: { name: string; korean?: string; instagram?: string; image?: string; url?: string; country?: string; booth?: string; post?: string; category: string }[] = [
  // Page 1
  { name: '스워츠샵', category: 'All brands' },
  { name: '스워트리리', instagram: 'sweetlili_made', booth: 'H08', post: 'https://www.instagram.com/p/DXy7keIGMAu/', category: 'All brands' },
  { name: '스튜디오 다다다', instagram: 'damy0w0', booth: 'F18', post: 'https://www.instagram.com/p/DXxHko0EkS5/', category: 'All brands' },
  { name: '스튜디오 후애', category: 'All brands' },
  { name: '스티커스', instagram: 'st2krs', post: 'https://www.instagram.com/p/DXt88fzAfFV/', category: 'All brands' },
  { name: '슬로우스터프', instagram: 'slow.stuff', booth: 'F05', post: 'https://www.instagram.com/p/DX3dMXeme04/', category: 'All brands' },
  { name: '시네샵', category: 'All brands' },
  { name: '썸딩비러브드', category: 'All brands' },
  { name: '아델리드로우', instagram: 'adelie.draw', booth: 'K06', post: 'https://www.instagram.com/p/DX1ckOYlBEt/', category: 'All brands' },
  { name: '아무스투', instagram: 'amustew', booth: 'C09', post: 'https://www.instagram.com/p/DX8cTi4kTrR/', category: 'All brands' },
  { name: '아춧코코', instagram: 'ahchuucoco', booth: 'G01', post: 'https://www.instagram.com/p/DX8aMoWmVsI/', category: 'All brands' },
  { name: '아코. 아이콩', instagram: 'xas2ko', booth: 'G04', post: 'https://www.instagram.com/p/DX3fa_2iZdT/', category: 'All brands' },
  { name: '아롱문구', category: 'All brands' },
  { name: '어쩔문구', instagram: 'sowhatmungu', booth: 'G02', post: 'https://www.instagram.com/p/DX09PLMiZ4h/', category: 'All brands' },
  { name: '에이투지클럽', instagram: 'atoz_club', booth: 'I05', post: 'https://www.instagram.com/p/DX3kzmOFBZU/', category: 'All brands' },
  { name: '엔젤버스데이', instagram: '_angel_birthday', booth: 'H14', post: 'https://www.instagram.com/p/DX188mdE6jT/', category: 'All brands' },
  { name: '연포포', instagram: 'yeonpopo_', booth: 'H13', post: 'https://www.instagram.com/p/DX6zkeIk3mJ/', category: 'All brands' },
  { name: '열새', instagram: 'yeolseti', booth: 'K03', post: 'https://www.instagram.com/p/DX4M-H1E-Dx/', category: 'All brands' },
  { name: '와이오클럽', instagram: 'y5club_', booth: 'A02', post: 'https://www.instagram.com/p/DX3LSQJASCF/', category: 'All brands' },
  { name: '요인', instagram: 'yyoinnn', booth: 'J02', category: 'All brands' },
  { name: '웨스티즈', instagram: 'westiez_', booth: 'F20', post: 'https://www.instagram.com/p/DX6zfZGlLDA/', category: 'All brands' },
  { name: '웨이투페치', instagram: 'waytoofetch_', booth: 'A01', post: 'https://www.instagram.com/p/DXy0FfNGeOU/', category: 'All brands' },
  { name: '유리', instagram: 'keemyurii', booth: 'I04', post: 'https://www.instagram.com/p/DX1A4Vwkunv/', category: 'All brands' },
  { name: '유리카', instagram: 'yurica_ugu', booth: 'C11', post: 'https://www.instagram.com/p/DXytzRAiS7E/', category: 'All brands' },
  { name: '유메', instagram: 'baby___yume_', booth: 'G06', post: 'https://www.instagram.com/p/DX0rTQXGgik/', category: 'All brands' },
  { name: '은새상점', instagram: 'little.bird_market', booth: 'J08', post: 'https://www.instagram.com/p/DXy-NJ-oLzx/', category: 'All brands' },
  { name: '이브포유', instagram: 'byyourside_eve', booth: 'H06', post: 'https://www.instagram.com/p/DX12_DGmCYi/', category: 'All brands' },
  { name: '임퍼펙트차일드', instagram: 'imperfectchiiild_', booth: 'D10', post: 'https://www.instagram.com/p/DXyhJ8Pmjmf/', category: 'All brands' },
  { name: '짜꾸짜꾸', instagram: 'zkzk_studio', booth: 'C12', category: 'All brands' },
  { name: '잘사라', instagram: 'jal___sara', booth: 'G17', post: 'https://www.instagram.com/p/DX855Mkk4Rm/', category: 'All brands' },
  { name: '재이하우스', instagram: 'jaei_house', post: 'https://www.instagram.com/p/DX38E53CcVt/', category: 'All brands' },
  { name: '점프점프하트', instagram: 'jumpjumpheart', booth: 'D14', post: 'https://www.instagram.com/p/DXwNHxbiR4_/', category: 'All brands' },
  { name: '정배', instagram: 'jbeagoop', category: 'All brands' },
  { name: '제니빌리지', instagram: 'jennyvillage', booth: 'H05', post: 'https://www.instagram.com/p/DX4XBFSkvpq/', category: 'All brands' },
  { name: '제리', instagram: 'jerry.bbang', post: 'https://www.instagram.com/p/DXTA_U0kx2M/', category: 'All brands' },
  { name: '제제유니버스', instagram: 'jeje_universe23', booth: 'K04', post: 'https://www.instagram.com/p/DX4CzmqD7Ho/', category: 'All brands' },
  { name: '제키베어', instagram: 'zekibear', booth: 'A07', post: 'https://www.instagram.com/p/DX885BvE-Ie/', category: 'All brands' },
  { name: '죠빔이', instagram: 'jjobimii', booth: 'D11', post: 'https://www.instagram.com/p/DX4EeB5mJst/', category: 'All brands' },
  { name: '지구침략', instagram: 'sekai.s2', booth: 'D19', post: 'https://www.instagram.com/p/DX6Wpmwk1v6/', category: 'All brands' },
  { name: '지옴', instagram: 'jee_yoom', booth: 'G15', post: 'https://www.instagram.com/p/DX3yauRifW7/', category: 'All brands' },
  { name: '쪼꼬지 패밀리', instagram: 'chocozy_family', booth: 'C17', post: 'https://www.instagram.com/p/DX1Hg5XlEYA/', category: 'All brands' },
  { name: '쭈', category: 'All brands' },
  { name: '청록', instagram: '_cheongnok', category: 'All brands' },
  { name: '초코메로', instagram: 'chocom3ro', booth: 'B15', post: 'https://www.instagram.com/p/DXzKCNflPEX/', category: 'All brands' },
  { name: '치리클럽', instagram: 'cheeryiclub', category: 'All brands' },
  { name: '칠영칠', instagram: '707.site', post: 'https://www.instagram.com/p/DRlpvRokRI6/', category: 'All brands' },
  { name: '케이와이아이', instagram: 'tokeiwaiai', booth: 'H18', post: 'https://www.instagram.com/p/DX9bGp6jyuq/', category: 'All brands' },
  { name: '케짐 빌리지', instagram: 'kezim_com', booth: 'F01', post: 'https://www.instagram.com/p/DX6hz_9FAc9/', category: 'All brands' },
  { name: '코마메링고', instagram: 'comame_ringo', booth: 'H01', post: 'https://www.instagram.com/p/DXyfhNJEnWQ/', category: 'All brands' },
  { name: '코스모 익스프레스', instagram: 'cosmo_exp', booth: 'H16', post: 'https://www.instagram.com/p/DXtsWx_j7bi/', category: 'All brands' },
  { name: '코코벤네', category: 'All brands' },
  { name: '코튼월드', instagram: 'cottonworld__', booth: 'J01', post: 'https://www.instagram.com/p/DX9LLdCAVUW/', category: 'All brands' },
  { name: '쿠마쿠마클럽', instagram: 'kumakuma_club', booth: 'E08', post: 'https://www.instagram.com/p/DX3qX83jh3W/', category: 'All brands' },
  { name: '쿠만만', instagram: 'quu.manman', booth: 'D12', post: 'https://www.instagram.com/p/DXzALUxEd4O/', category: 'All brands' },
  { name: '쿠킹쿠키', instagram: 'cooking._.cookie', booth: 'C15', post: 'https://www.instagram.com/p/DX3U4iWgaIl/', category: 'All brands' },
  { name: '크래커드크랙', instagram: 'crackered_crack', booth: 'K09', post: 'https://www.instagram.com/p/DXwi9iSjw-q/', category: 'All brands' },
  { name: '크리미크럼즈', instagram: 'creamy.crumbz', booth: 'B10', post: 'https://www.instagram.com/p/DX8Wv46GQdx/', category: 'All brands' },
  { name: '클론연구소', instagram: 'lab_clone', booth: 'D03', post: 'https://www.instagram.com/p/DX9bNwvE36B/', category: 'All brands' },
  { name: '키노코', instagram: 'kono_kinoko', booth: 'G07', post: 'https://www.instagram.com/p/DX5oSlpE_A3/', category: 'All brands' },
  { name: '탁짜밀문방구', instagram: 'table_alae_mnbg', booth: 'H02', post: 'https://www.instagram.com/p/DX6w7kGk3Ob/', category: 'All brands' },
  { name: '테트라포트멜론티', instagram: 'tetrapod.melontea', booth: 'B16', post: 'https://www.instagram.com/p/DX1ZKEfkU4B/', category: 'All brands' },
  { name: '티티포레스트', instagram: 'titi_forest', booth: 'H04', post: 'https://www.instagram.com/p/DUjKAtHE5kS/', category: 'All brands' },
  { name: '파나모나걸스', instagram: 'panamona_girls', booth: 'B18', post: 'https://www.instagram.com/p/DX0-hPDEmoC/', category: 'All brands' },
  { name: '파사', instagram: 'pasa.aori', booth: 'H03', post: 'https://www.instagram.com/p/DRg6BoJjioA/', category: 'All brands' },
  { name: '퍼지랜드', instagram: 'fuzzyland.kr', booth: 'F11', post: 'https://www.instagram.com/p/DXy3xddD_RM/', category: 'All brands' },
  { name: '펄리버튼', instagram: 'pearly_button', post: 'https://www.instagram.com/p/DX1f-8wiXDO/', category: 'All brands' },
  { name: '평화조각', instagram: 'pyunghwa_jogak', post: 'https://www.instagram.com/p/DX4CdjvEjPv/', category: 'All brands' },
  { name: '포랑', instagram: 'forang.kr', booth: 'D01', post: 'https://www.instagram.com/p/DX11NNDkle9/', category: 'All brands' },
  { name: '포베', instagram: 'pobe_store', category: 'All brands' },
  { name: '포에티코', instagram: 'poetico.kr', booth: 'H07', post: 'https://www.instagram.com/p/DX0x0lAlFpq/', category: 'All brands' },
  { name: '포포', instagram: 'popo_for_u', post: 'https://www.instagram.com/p/DT99HGwDxSU/', category: 'All brands' },
  { name: '폴랑폴랑', instagram: 'pollang2', post: 'https://www.instagram.com/p/DX10alzERKD/', category: 'All brands' },
  { name: '푸름핑클럽', instagram: 'pureum.thing.club', booth: 'H20', post: 'https://www.instagram.com/p/DXoYG1QgBsH/', category: 'All brands' },
  { name: '프롬투스튜디오', instagram: 'fromtostudio', booth: 'E06', post: 'https://www.instagram.com/p/DX39IybEmJe/', category: 'All brands' },
  { name: '프리즐프렌즈', instagram: 'frizzle_frienzs', booth: 'E09', post: 'https://www.instagram.com/p/DX6QdahH_6p/', category: 'All brands' },
  { name: '핑루', category: 'All brands' },
  { name: '하기노러브', category: 'All brands' },
  { name: '하트쉽 스튜디오', instagram: 'heartsheep.studio', booth: 'G12', category: 'All brands' },
  { name: '해니마니', instagram: 'henimani_store', booth: 'B19', post: 'https://www.instagram.com/p/DXzLmZUjwiF/', category: 'All brands' },
  { name: '해피낭데이', instagram: 'happy_nyang_day', booth: 'I09', post: 'https://www.instagram.com/p/DX1Q4_Fkya3/', category: 'All brands' },
  { name: '해피스트플러피샵', instagram: 'happiest_fluffy_shop', booth: 'I01', post: 'https://www.instagram.com/p/DX1LH0bktY0/', category: 'All brands' },
  { name: '허니올스튜디오', category: 'All brands' },
  { name: '헤이오오스튜디오', instagram: 'hay.oo.studio', booth: 'H03', post: 'https://www.instagram.com/p/DX1c7YwiX51/', category: 'All brands' },
  { name: '훈찌마켓', category: 'All brands' },
  { name: '히밍', instagram: 'heemingraphic', booth: 'H15', post: 'https://www.instagram.com/p/DX1M2GhmFhl/', category: 'All brands' },
  { name: '히즈', instagram: 'heez_ioi', booth: 'B17', post: 'https://www.instagram.com/p/DX3zO6klAlW/', category: 'All brands' },
  { name: '잘 자', instagram: 'uwu__zz2', booth: 'D13', post: 'https://www.instagram.com/p/DX6l03NHeUh/', category: 'All brands' },
  { name: '사나다', instagram: 's2anada', booth: 'F10', post: 'https://www.instagram.com/p/DX3huJ1kWS-/', category: 'All brands' },
  { name: '냠냠', instagram: 'yamyam.fancy', booth: 'B14', post: 'https://www.instagram.com/p/DX2-Vr0kjVx/', category: 'All brands' },
  { name: '코코넨네', instagram: 'koconenne', booth: 'E10', post: 'https://www.instagram.com/p/DXx9cbaGbjI/', category: 'All brands' },
  { name: '수야로로', instagram: 'suyaroro', booth: 'D16', post: 'https://www.instagram.com/p/DXy53BSj5o8/', category: 'All brands' },
  { name: 'FLUFFYS', category: 'All brands' },
  { name: 'Gla:ssy', instagram: 'glassy_xyz', booth: 'H17', post: 'https://www.instagram.com/p/DX9FeY8E4Bz/', category: 'All brands' },
  { name: 'MODABI', instagram: 'modabi_sea', booth: 'K07', post: 'https://www.instagram.com/p/DX7AyrPD6bt/', category: 'All brands' },
  { name: 'natsu.nya', instagram: 'natsu.nyaa', booth: 'K12', post: 'https://www.instagram.com/p/DX9U4KxCSBE/', category: 'All brands' },
  { name: 'Rocoa', instagram: 'popbanao', booth: 'B12', category: 'All brands' },
  { name: 'sweets sh☆p', instagram: 'sweeetsshop_', booth: 'K15', post: 'https://www.instagram.com/p/DX00-Uekwbq/', category: 'All brands' },
  { name: 'Labyss', instagram: 'labyss_archive', booth: 'A14', post: 'https://www.instagram.com/p/DX1ZFImE90B/', category: 'All brands' },
  // Page 2
  { name: '갱갱', instagram: 'gaengxgaeng', booth: 'J06', post: 'https://www.instagram.com/p/DXy791wCbi4/', category: 'All brands' },
  { name: '검은 새벽-김래곤', instagram: 'kimlaegon911', booth: 'F12', post: 'https://www.instagram.com/p/DXtoqcVj9NC/', category: 'All brands' },
  { name: '고양이방앗간', instagram: '_millcat', booth: 'E04', post: 'https://www.instagram.com/p/DX1dZ6mj3BJ/', category: 'All brands' },
  { name: '고요', instagram: 'goyo_ih', booth: 'A13', post: 'https://www.instagram.com/p/DX1rej0D33k/', category: 'All brands' },
  { name: '고운그림', instagram: 'gowoongrim', booth: 'D06', post: 'https://www.instagram.com/p/DXs-ebaGZml/', category: 'All brands' },
  { name: '구미리', instagram: 's29umm', booth: 'E18', post: 'https://www.instagram.com/p/DX3zibFk2bs/', category: 'All brands' },
  { name: '귀여워핑크클럽', instagram: 'dammong_33', booth: 'D17', post: 'https://www.instagram.com/p/DX7RJY9j99s/', category: 'All brands' },
  { name: '그렁그렁단', instagram: 'grgr_dan', booth: 'D05', post: 'https://www.instagram.com/p/DX38S9yCeL9/', category: 'All brands' },
  { name: '그림자 행성', instagram: 'leena_176', booth: 'F13', post: 'https://www.instagram.com/p/DXvgGilkdmS/', category: 'All brands' },
  { name: '김모양군', instagram: 'kim_moyangkun', booth: 'D09', post: 'https://www.instagram.com/p/DXyOAv8E7Xt/', category: 'All brands' },
  { name: '김부록씨', instagram: 'pxxulockssi', booth: 'C01', post: 'https://www.instagram.com/p/DXwK8-TEYOR/', category: 'All brands' },
  { name: '꾸모꾸모', instagram: 'kkumo_kkumo', booth: 'B21', post: 'https://www.instagram.com/p/DXy2vJRE8x9/', category: 'All brands' },
  { name: '나나스무드', instagram: 'nanasmood', category: 'All brands' },
  { name: '나로메로 캔디', instagram: 'nar0_0mero_o', category: 'All brands' },
  { name: '나모쿠', instagram: 'namoku_', booth: 'C10', post: 'https://www.instagram.com/p/DXyg8UakyB7/', category: 'All brands' },
  { name: '나제', instagram: 'nazeondo', booth: 'C06', post: 'https://www.instagram.com/p/DXyWiMIkRSF/', category: 'All brands' },
  { name: '나조나조', instagram: 'nazonyazo', booth: 'C02', post: 'https://www.instagram.com/p/DX9KAj2j_1H/', category: 'All brands' },
  { name: '나츠나', category: 'All brands' },
  { name: '낭만', instagram: 'my_youth__diary', category: 'All brands' },
  { name: '남남', category: 'All brands' },
  { name: '넛코코', instagram: 'nutcoco_s', booth: 'E02', post: 'https://www.instagram.com/p/DX4JvOXE-yb/', category: 'All brands' },
  { name: '네버더레스', instagram: 'wwwneverthelesscom', post: 'https://www.instagram.com/p/DXygPiLk6Bs/', category: 'All brands' },
  { name: '단팥', instagram: 'danpat_s', post: 'https://www.instagram.com/p/DX1p9QJk7qI/', category: 'All brands' },
  { name: '더프린티드걸', instagram: 'theprintedgrl', booth: 'G09', post: 'https://www.instagram.com/p/DX1rr2OE1CJ/', category: 'All brands' },
  { name: '덩이나라', instagram: 'dung2nara', post: 'https://www.instagram.com/p/DXynhZ6kYku/', category: 'All brands' },
  { name: '도꾸마리', instagram: 'dokkumalee', booth: 'K08', post: 'https://www.instagram.com/p/DX4IOvCgU7g/', category: 'All brands' },
  { name: '도르', category: 'All brands' },
  { name: '도리', category: 'All brands' },
  { name: '도미월드', instagram: 'domi__i', category: 'All brands' },
  { name: '도시오브드림', instagram: 'dociofdreams', booth: 'C05', post: 'https://www.instagram.com/p/DX8ofLkEYEP/', category: 'All brands' },
  { name: '동식물원', instagram: 'dongsikmool_one', booth: 'B06', post: 'https://www.instagram.com/p/DX5yG36EzKu/', category: 'All brands' },
  { name: '라리데이즈', instagram: '0_0_yurari', booth: 'K10', post: 'https://www.instagram.com/p/DX0mxSsEZUl/', category: 'All brands' },
  { name: '라비스', category: 'All brands' },
  { name: '라연팬시', instagram: 'rayeonfancy', booth: 'D07', post: 'https://www.instagram.com/p/DX3oVRnkfpg/', category: 'All brands' },
  { name: '랄랑', instagram: 'lalangheej', booth: 'F16', post: 'https://www.instagram.com/p/DX1BXivE81a/', category: 'All brands' },
  { name: '러버스픽미', category: 'All brands' },
  { name: '럽피클럽', instagram: 'luvpyclub', booth: 'F14', post: 'https://www.instagram.com/p/DXy_lp8E0jV/', category: 'All brands' },
  { name: '레로카', instagram: '_reroca_', booth: 'C14', post: 'https://www.instagram.com/p/DX6qYB0lEGx/', category: 'All brands' },
  { name: '로지스티커', instagram: 'rosie_sticker', booth: 'I06', post: 'https://www.instagram.com/p/DX3p-d4CQc6/', category: 'All brands' },
  { name: '로튼캔들', instagram: 'rottencandle.x_x', booth: 'D04', post: 'https://www.instagram.com/p/DX0zGReAaQ_/', category: 'All brands' },
  { name: '루아', instagram: 'rua_9_8', booth: 'E05', post: 'https://www.instagram.com/p/DX1Wj52k0WS/', category: 'All brands' },
  { name: '룬튜디오', instagram: 'roontudio', booth: 'K14', post: 'https://www.instagram.com/p/DXv3W_HFNzK/', category: 'All brands' },
  { name: '룹비긴즈', instagram: 'fromlooptobegins', booth: 'C03', post: 'https://www.instagram.com/p/DXytGy3Ec6K/', category: 'All brands' },
  { name: '르미', instagram: 'of_reumi', booth: 'E03', post: 'https://www.instagram.com/p/DX3ubtPEk1P/', category: 'All brands' },
  { name: '리코마루', instagram: 'rico_maruu', booth: 'I17', post: 'https://www.instagram.com/p/DWoe1s0k23x/', category: 'All brands' },
  { name: '리틀타이니룸', instagram: 'littletinyroom', category: 'All brands' },
  { name: '마고즈', instagram: 'hajimagomin', booth: 'E01', category: 'All brands' },
  { name: '마고행수', instagram: 'magohaengsoo', booth: 'H12', category: 'All brands' },
  { name: '마법사고양상점', instagram: 'dalp_01', booth: 'C08', post: 'https://www.instagram.com/p/DX66VIRlL-s/', category: 'All brands' },
  { name: '마시랜드', category: 'All brands' },
  { name: '마요씨', instagram: 'mayo_see_', booth: 'E19', post: 'https://www.instagram.com/p/DX5-vsbEjH6/', category: 'All brands' },
  { name: '마이모이', instagram: 'maimoi_y', booth: 'G03', post: 'https://www.instagram.com/p/DX3mfyoER2H/', category: 'All brands' },
  { name: '만짱상점', instagram: 'manjang_store', booth: 'E15', post: 'https://www.instagram.com/p/DX1XmQVE_yp/', category: 'All brands' },
  { name: '맹글도어', category: 'All brands' },
  { name: '멜로우 아라모드', instagram: 'ddamma_o3o', booth: 'A06', post: 'https://www.instagram.com/p/DXrCB96k43V/', category: 'All brands' },
  { name: '모루', category: 'All brands' },
  { name: '모리마', instagram: 'molima.shop', booth: 'G11', post: 'https://www.instagram.com/p/DX4Uhf3kv0Z/', category: 'All brands' },
  { name: '모모이하우스', instagram: 'momoi_house', post: 'https://www.instagram.com/p/DXygvzlE-Zb/', category: 'All brands' },
  { name: '모셔리 스튜디오', instagram: 'moseori_studio', booth: 'C07', post: 'https://www.instagram.com/p/DXyUiTgk7is/', category: 'All brands' },
  { name: '모이도이', instagram: 'moii_ttoi', booth: 'F09', post: 'https://www.instagram.com/p/DX1dOdsEzSg/', category: 'All brands' },
  { name: '몽몽스베쥬', instagram: 'mongmongspace', post: 'https://www.instagram.com/p/DXjhG-XEow-/', category: 'All brands' },
  { name: '무디클럽', instagram: 'moodyclu_b', booth: 'J08', post: 'https://www.instagram.com/p/DX6r-KXj5bu/', category: 'All brands' },
  { name: '믈뇨', category: 'All brands' },
  { name: '미나', instagram: 'm_i1nano', booth: 'E13', post: 'https://www.instagram.com/p/DX6122ND3Q7/', category: 'All brands' },
  { name: '미나냥마켓', instagram: 'mnn_neko', booth: 'E14', post: 'https://www.instagram.com/p/DXeF0WzGc0B/', category: 'All brands' },
  { name: '미료코', category: 'All brands' },
  { name: '미타코어', instagram: 'metiny_0429', booth: 'K13', category: 'All brands' },
  { name: '미히', category: 'All brands' },
  { name: '밋츠유', instagram: 'meets2_u', booth: 'K11', post: 'https://www.instagram.com/p/DX3hvr5D6Iw/', category: 'All brands' },
  { name: '박남', instagram: 'parknyam', booth: 'G18', post: 'https://www.instagram.com/p/DX6gFvrGWF_/', category: 'All brands' },
  { name: '반곱실', instagram: 'curly___curly', booth: 'G05', post: 'https://www.instagram.com/p/DX14yyGk53D/', category: 'All brands' },
  { name: '백구삼스튜디오', instagram: '193studio', booth: 'D02', post: 'https://www.instagram.com/p/DX1OUsQidJs/', category: 'All brands' },
  { name: '베베', category: 'All brands' },
  { name: '베비마루', instagram: 'babi_maru__', booth: 'G10', post: 'https://www.instagram.com/p/DX54gyPkZGp/', category: 'All brands' },
  { name: '별사세', instagram: 'byeolsase', post: 'https://www.instagram.com/p/DXwX72ZkQa9/', category: 'All brands' },
  { name: '보링보링', instagram: 'shop.boringboring', post: 'https://www.instagram.com/p/DX1oLLqkyQ6/', category: 'All brands' },
  { name: '블랙레터', instagram: 'blackletter_kr', booth: 'B04', post: 'https://www.instagram.com/p/DX9S9iVEZVK/', category: 'All brands' },
  { name: '빙빙문구', instagram: 'bingbing_mungu', booth: 'F19', category: 'All brands' },
  { name: '보레월드', instagram: 'tawac3po', booth: 'E17', post: 'https://www.instagram.com/p/DX3tPWpkTjC/', category: 'All brands' },
  { name: '뽁뽁즈', instagram: 'ppokppokz', post: 'https://www.instagram.com/p/DXWGeTpEw6u/', category: 'All brands' },
  { name: '싸나다', category: 'All brands' },
  { name: '싸무국', instagram: '3123report_', booth: 'K16', post: 'https://www.instagram.com/p/DX9Jq03D96G/', category: 'All brands' },
  { name: '싸오코', instagram: 'sa0ko0', booth: 'G08', post: 'https://www.instagram.com/p/DX1CY2SiSY1/', category: 'All brands' },
  { name: '서리꽃', instagram: 'seorikkoch', booth: 'A09', post: 'https://www.instagram.com/p/DX0uXW5Et3I/', category: 'All brands' },
  { name: '셔티', instagram: '3eotty', category: 'All brands' },
  { name: '소녀교실', instagram: 'sonyeokyosil', booth: 'F05', post: 'https://www.instagram.com/p/DJyUashR4Fz/', category: 'All brands' },
  { name: '소누', instagram: 'sonu_choi_', booth: 'K01', post: 'https://www.instagram.com/p/DX2BLT9k6k-/', category: 'All brands' },
  { name: '소랏', instagram: 'sorat_illust', post: 'https://www.instagram.com/p/DX9ODPuk65H/', category: 'All brands' },
  { name: '소소히히', instagram: '_soso_hehe', booth: 'A10', post: 'https://www.instagram.com/p/DXyyKOFEleN/', category: 'All brands' },
  { name: '소푸', instagram: 'sopu_village', booth: 'C16', post: 'https://www.instagram.com/p/DX0zqmEDrha/', category: 'All brands' },
  { name: '수아로로', category: 'All brands' },
  { name: '수중', instagram: 's0ojoong', booth: 'A05', post: 'https://www.instagram.com/p/DX1TYVPkutR/', category: 'All brands' },
  { name: '슈가티', instagram: 'sugar_teeaa', booth: 'H19', post: 'https://www.instagram.com/p/DX9fkLGEWRl/', category: 'All brands' },
  { name: '스닙스니페티스닙', instagram: 'leenahoo_drawing', category: 'All brands' },
  { name: '스우', instagram: 'sw_o.ov', booth: 'J09', post: 'https://www.instagram.com/p/DX04RecDwnk/', category: 'All brands' },
]

const CATEGORIES = [...new Set(BRANDS.map(b => b.category))]

function PostModal({ postUrl, name, onClose }: { postUrl: string; name: string; onClose: () => void }) {
  const shortcode = postUrl.match(/\/p\/([^/?]+)/)?.[1]
  if (!shortcode) return null
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 500, color: 'white' }}>{name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>×</button>
        </div>
        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/`}
          width="400"
          height="480"
          frameBorder="0"
          scrolling="no"
          style={{ borderRadius: '12px', display: 'block', width: '100%', border: 'none' }}
        />
        <a href={postUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textDecoration: 'none' }}>
          Open on Instagram ↗
        </a>
      </div>
    </div>,
    document.body
  )
}

function BrandCard({ b, onView }: { b: typeof BRANDS[0]; onView: (url: string, name: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const shortcode = b.post?.match(/\/p\/([^/?]+)/)?.[1]
  return (
    <div style={{ background: 'white', borderRadius: '14px', border: `0.5px solid ${expanded ? 'var(--dark-blue)' : 'rgba(122,92,69,0.1)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      {/* Top row */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BrandIcon brand={b} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)' }}>{b.name}</span>
            {b.booth && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 600, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 7px', borderRadius: '99px', flexShrink: 0 }}>{b.booth}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
            {b.instagram && <a href={`https://www.instagram.com/${b.instagram}/`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>@{b.instagram}</a>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {b.post && (
            <button onClick={() => setExpanded(e => !e)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, color: expanded ? 'var(--cream)' : 'var(--dark-blue)', background: expanded ? 'var(--dark-blue)' : 'rgba(31,58,95,0.06)', padding: '3px 10px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>
              {expanded ? 'Close' : 'View ↓'}
            </button>
          )}
          <span style={{ fontSize: '14px' }}>🇰🇷</span>
        </div>
      </div>
      {/* Inline Instagram embed */}
      {expanded && shortcode && (
        <div style={{ borderTop: '0.5px solid rgba(122,92,69,0.08)' }}>
          <iframe
            src={`https://www.instagram.com/p/${shortcode}/embed/`}
            width="100%"
            height="480"
            frameBorder="0"
            scrolling="no"
            loading="lazy"
            style={{ display: 'block', border: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

function BrandIcon({ brand }: { brand: typeof BRANDS[0] }) {
  const [ok, setOk] = useState(true)
  const src = brand.image ?? (brand.url ? `https://www.google.com/s2/favicons?domain=${brand.url}&sz=128` : null)
  return (
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--beige)', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {src && ok ? (
        <img src={src} alt={brand.name} onError={() => setOk(false)} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', fontWeight: 300, color: 'var(--tan)' }}>
          {brand.name.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default function DotDotExpressCataloguePage() {
  const [activePost, setActivePost] = useState<{ url: string; name: string } | null>(null)

  return (
    <>
      {activePost && <PostModal postUrl={activePost.url} name={activePost.name} onClose={() => setActivePost(null)} />}
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
              <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
              <span>Seoul Illustration Market</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              DOTDOTDOT <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>v.7</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
              Seoul · Korean illustrator &amp; stationery market
            </p>
            {BRANDS.length > 0 && (
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
                {BRANDS.length} participating brands
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Order from this fair →
              </a>
              <a href="https://www.instagram.com/dot.dot.dot.express/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
                @dot.dot.dot.express ↗
              </a>
            </div>
          </div>

          {/* Brands */}
          {BRANDS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
                Brand list coming soon.
              </p>
            </div>
          ) : (
            CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom: '56px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                  {cat}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                  {BRANDS.filter(b => b.category === cat).map(b => (
                    <BrandCard key={b.name} b={b} onView={(url, name) => setActivePost({ url, name })} />
                  ))}
                </div>
              </div>
            ))
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
