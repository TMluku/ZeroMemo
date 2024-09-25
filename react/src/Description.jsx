import image from './assets/image.png'
import './Description.css'

export default function Description() {
    return (
        <>
            <h2>
                買い物リストに加えるのを忘れることを無くしたい <br/>
                一人暮らしちょっと節約生活頑張るA型大学生向けの <br/>
                マッチングアプリ風メモアプリ
                受動的なメモづくりを提供
            </h2>
            <img src={image} alt="ゼロメモのロゴ" width={200}/>
            <ul>
                <li> 必要なものをswipe </li>
                <li> 定期的な必要なものの復活 </li>
            </ul>
        </>
    )
}