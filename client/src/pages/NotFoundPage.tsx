import { Link } from 'react-router-dom';
import { StateMessage } from '../components/StateMessage.tsx';

export function NotFoundPage() {
  return (
    <section className="section shell">
      <StateMessage
        glyph="訊號丟失"
        title="這卷膠片不在架上"
        text="你輸入的頁面不存在。回到首頁，或到片庫重新挑一部電影。"
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link className="btn btn--solid" to="/">
            回到首頁
          </Link>
          <Link className="btn" to="/movies">
            前往片庫
          </Link>
        </div>
      </StateMessage>
    </section>
  );
}
